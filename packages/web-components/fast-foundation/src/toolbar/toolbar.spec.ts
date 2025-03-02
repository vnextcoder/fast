import { DOM } from "@microsoft/fast-element";
import { customElement } from "@microsoft/fast-element";
import { keyArrowRight, Orientation } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { Toolbar, toolbarTemplate as template } from "./index";

const FASTToolbar = Toolbar.compose({
  baseName: "toolbar",
  template,
  shadowOptions: {
    delegatesFocus: true
  }
})

async function setup() {
  const { element, connect, disconnect, parent } = await fixture(
    FASTToolbar()
  );

  const startButton = document.createElement("button");
  startButton.textContent = "startButton";
  startButton.slot="start";

  const control1 = document.createElement("button");
  control1.textContent = "control1";

  const control2 = document.createElement("button");
  control2.textContent = "control2";

  const control3 = document.createElement("button");
  control3.textContent = "control3";

  element.appendChild(startButton);
  element.appendChild(control1);
  element.appendChild(control2);
  element.appendChild(control3);

  return { element, connect, disconnect, document, parent };
}

async function setupEmpty() {
  const { element, connect, disconnect, parent } = await fixture(
    FASTToolbar()
  );

  return { element, connect, disconnect, document, parent };
}

describe("Toolbar", () => {
  it("should have a role of `toolbar`", async () => {
    const { element, connect, disconnect } = await setup();

    await connect();

    expect(element.getAttribute("role")).to.equal("toolbar");

    await disconnect();
  });

  it("should have a default orientation of `horizontal`", async () => {
    const { element, connect, disconnect } = await setup();

    await connect();

    expect(element.getAttribute("orientation")).to.equal(Orientation.horizontal);

    await disconnect();
  });

  it("should move focus to its first focusable element when it receives focus", async () => {
    const { element, connect, disconnect, document } = await setup();

    await connect();

    element.focus();

    expect(document.activeElement?.textContent).to.equal("startButton");

    await disconnect();
  });

  it("should move focus to next element when keyboard incrementer is pressed", async () => {
    const { element, connect, disconnect, document } = await setup();

    await connect();

    element.focus();

    expect(document.activeElement?.textContent).to.equal("startButton");

    const event = new KeyboardEvent("keydown", {
        key: keyArrowRight,
    } as KeyboardEventInit);
    element.dispatchEvent(event);

    expect(document.activeElement?.textContent).to.equal("control1");

    await disconnect();
  });

  it("should move focus to next element when keyboard incrementer is pressed and start slot content is added after connect", async () => {
    const { element, connect, disconnect, document } = await setupEmpty();

    await connect();

    const startButton1 = document.createElement("button");
    startButton1.textContent = "startButton1";
    startButton1.slot = "start";

    const startButton2 = document.createElement("button");
    startButton2.textContent = "startButton2";
    startButton2.slot = "start";

    element.appendChild(startButton1);
    element.appendChild(startButton2);

    await DOM.nextUpdate();

    element.focus();

    expect(document.activeElement).to.equal(startButton1);

    const event = new KeyboardEvent("keydown", {
        key: keyArrowRight,
    } as KeyboardEventInit);
    element.dispatchEvent(event);

    expect(document.activeElement).to.equal(startButton2);

    await disconnect();
  });

  it("should move focus to next element when keyboard incrementer is pressed and end slot content is added after connect", async () => {
    const { element, connect, disconnect, document } = await setupEmpty();

    await connect();

    const endButton1 = document.createElement("button");
    endButton1.textContent = "endButton1";
    endButton1.slot = "end";

    const endButton2 = document.createElement("button");
    endButton2.textContent = "endButton2";
    endButton2.slot = "end";

    element.appendChild(endButton1);
    element.appendChild(endButton2);

    await DOM.nextUpdate();

    element.focus();

    expect(document.activeElement).to.equal(endButton1);

    const event = new KeyboardEvent("keydown", {
        key: keyArrowRight,
    } as KeyboardEventInit);
    element.dispatchEvent(event);

    expect(document.activeElement).to.equal(endButton2);

    await disconnect();
  });
});
