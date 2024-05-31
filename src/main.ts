import { BACKGROUND, TEXT_COLOR } from "./constants";
import { SvgBuilder } from "./svg";

import "./style.css";

const svg = document.querySelector<SVGElement>(".cover");

if (!svg) {
    throw new Error("Cannot find SVG");
}

const cover = new SvgBuilder(svg);

cover.setBackground(BACKGROUND).setTitle({
    text: `Hello\nworld`,
    color: TEXT_COLOR,
    fontSize: 80,
});
