export type TextAlign = "left" | "center" | "right";

type SettingsData = {
    theme: string;
    title: string;
    fontSize: number;
    textAlign: TextAlign;
};

interface SettingsChangeHandler {
    (data: SettingsData): void;
}

const DEFAULT_FONT_SIZE = 80;

export class SettingsManager {
    private readonly themeSelect: HTMLSelectElement;
    private readonly textarea: HTMLTextAreaElement;
    private readonly fontSizeInput: HTMLInputElement;
    private readonly alignSelect: HTMLSelectElement;
    private readonly downloadPng: HTMLButtonElement;
    private readonly downloadSvg: HTMLButtonElement;

    constructor(private readonly form: HTMLFormElement) {
        this.themeSelect = this.querySelector<HTMLSelectElement>(
            "#theme",
            "Cannot find theme select",
        );
        this.textarea = this.querySelector<HTMLTextAreaElement>(
            "textarea",
            "Cannot find text area",
        );
        this.fontSizeInput = this.querySelector<HTMLInputElement>(
            "#font",
            "Cannot find font-size input",
        );
        this.alignSelect = this.querySelector<HTMLSelectElement>(
            "#align",
            "Cannot find align select",
        );
        this.downloadPng = this.querySelector<HTMLButtonElement>(
            "[name=png]",
            "Cannot find download PNG button",
        );
        this.downloadSvg = this.querySelector<HTMLButtonElement>(
            "[name=svg]",
            "Cannot find download SVG button",
        );

        this.form.addEventListener("submit", (event) => event.preventDefault());
    }

    onSettingsChange(callback: SettingsChangeHandler) {
        const handler = () => {
            callback({
                theme: this.theme,
                title: this.title,
                fontSize: this.fontSize,
                textAlign: this.textAlign,
            });
        };

        this.themeSelect.addEventListener("change", handler);
        this.textarea.addEventListener("input", handler);
        this.fontSizeInput.addEventListener("change", handler);
        this.alignSelect.addEventListener("change", handler);
    }

    onDownloadPng(callback: () => void) {
        this.downloadPng.addEventListener("click", () => callback());
        this.form.addEventListener("submit", () => callback());
    }

    onDownloadSvg(callback: () => void) {
        this.downloadSvg.addEventListener("click", () => callback());
    }

    get theme() {
        return this.themeSelect.value;
    }

    get title() {
        return this.textarea.value;
    }

    get fontSize() {
        return parseInt(this.fontSizeInput.value, 10) || DEFAULT_FONT_SIZE;
    }

    get textAlign(): TextAlign {
        return this.alignSelect.value as TextAlign;
    }

    protected querySelector<E extends Element = Element>(
        selector: string,
        error: string,
    ): E {
        const element = this.form.querySelector<E>(selector);

        if (!element) {
            throw new Error(error);
        }

        return element;
    }
}
