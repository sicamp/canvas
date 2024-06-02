import { STRIPE_COLORS } from "./constants";
import { getFontsRules } from "./fonts";
import { SettingsManager } from "./settings";
import { SvgBuilder } from "./svg";
import { download } from "./download";

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

const cover = new SvgBuilder(svg);

cover
    .setTheme(settings.theme)
    .addStripes(STRIPE_COLORS)
    .setYear(new Date().getUTCFullYear())
    .setLocation("Пермь")
    .setTitle({
        text: settings.title,
        fontSize: settings.fontSize,
        textAlign: settings.textAlign,
    });

settings.onSettingsChange((data) => {
    cover.setTitle({
        text: data.title,
        fontSize: data.fontSize,
        textAlign: data.textAlign,
    });

    cover.setTheme(data.theme);
});

settings.onDownload(async () => {
    const imageData = await cover.createDataUri();

    download("sicamp.png", imageData);
});

async function initAsync() {
    const rules = await getFontsRules();
    cover.injectFonts(rules);
}

initAsync();
