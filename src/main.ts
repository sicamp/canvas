import { STRIPE_COLORS } from "./constants";
import { SettingsManager } from "./settings";
import { SvgBuilder } from "./svg";

import "./style.css";

const svg = document.querySelector<SVGElement>(".cover");

if (!svg) {
    throw new Error("Cannot find SVG");
}

const form = document.querySelector<HTMLFormElement>("form");

if (!form) {
    throw new Error("Cannot find form");
}

const settings = new SettingsManager(form);

settings.onTitleChange((data) => {
    cover.setTitle({
        text: data.title,
        fontSize: data.fontSize,
    });
});

const cover = new SvgBuilder(svg);

cover
    .addStripes(STRIPE_COLORS)
    .setYear(new Date().getUTCFullYear())
    .setLocation("Пермь")
    .setTitle({ text: settings.title, fontSize: 80 });
