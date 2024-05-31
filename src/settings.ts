type SettingsData = {
    title: string;
    fontSize: number;
};

interface SettingsChangeHandler {
    (data: SettingsData): void;
}

const DEFAULT_FONT_SIZE = 80;

export class SettingsManager {
    private readonly textarea: HTMLTextAreaElement;
    private readonly fontSizeInput: HTMLInputElement;

    constructor(private readonly form: HTMLFormElement) {
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
    }

    onTitleChange(callback: SettingsChangeHandler) {
        this.textarea.addEventListener("input", () => {
            callback({
                title: this.title,
                fontSize: this.fontSize,
            });
        });

        this.fontSizeInput.addEventListener("change", () => {
            callback({
                title: this.title,
                fontSize: this.fontSize,
            });
        });
    }

    get title() {
        return this.textarea.value;
    }

    get fontSize() {
        return parseInt(this.fontSizeInput.value, 10) || DEFAULT_FONT_SIZE;
    }
}
