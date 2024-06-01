type SettingsData = {
    theme: string;
    title: string;
    fontSize: number;
};

interface SettingsChangeHandler {
    (data: SettingsData): void;
}

const DEFAULT_FONT_SIZE = 80;

export class SettingsManager {
    private readonly themeSelect: HTMLSelectElement;
    private readonly textarea: HTMLTextAreaElement;
    private readonly fontSizeInput: HTMLInputElement;
    private readonly downloadButton: HTMLButtonElement;

    constructor(private readonly form: HTMLFormElement) {
        const themeSelect =
            this.form.querySelector<HTMLSelectElement>("select");

        if (!themeSelect) {
            throw new Error("Cannot find theme select");
        }

        this.themeSelect = themeSelect;

        const inputTextArea =
            this.form.querySelector<HTMLTextAreaElement>("textarea");

        if (!inputTextArea) {
            throw new Error("Cannot find text area");
        }

        this.textarea = inputTextArea;

        const fontSizeInput =
            this.form.querySelector<HTMLInputElement>("#font");

        if (!fontSizeInput) {
            throw new Error("Cannot find font-size input");
        }

        this.fontSizeInput = fontSizeInput;

        const downloadButton =
            this.form.querySelector<HTMLButtonElement>("button");

        if (!downloadButton) {
            throw new Error("Cannot find download button");
        }

        this.downloadButton = downloadButton;
    }

    onSettingsChange(callback: SettingsChangeHandler) {
        const handler = () => {
            callback({
                theme: this.theme,
                title: this.title,
                fontSize: this.fontSize,
            });
        };

        this.themeSelect.addEventListener("change", handler);
        this.textarea.addEventListener("input", handler);
        this.fontSizeInput.addEventListener("change", handler);
    }

    onDownload(callback: () => void) {
        this.downloadButton.addEventListener("click", callback);
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
}
