import { BACKGROUND, STRIPE_COLORS, TEXT_COLOR } from "./constants";
import { SvgBuilder } from "./svg";

import "./style.css";

const svg = document.querySelector<SVGElement>(".cover");

if (!svg) {
    throw new Error("Cannot find SVG");
}

const inputTextArea = document.querySelector<HTMLTextAreaElement>("textarea");

if (!inputTextArea) {
    throw new Error("No text area");
}

inputTextArea.addEventListener("input", () => {
    cover.setTitle({
        text: inputTextArea.value,
        color: TEXT_COLOR,
        fontSize: 80,
    });
});

const cover = new SvgBuilder(svg);

cover
    .setBackground(BACKGROUND)
    .addStripes(STRIPE_COLORS)
    .setTitle({ text: inputTextArea.value, color: TEXT_COLOR, fontSize: 80 });
