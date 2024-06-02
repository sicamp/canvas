import { THEMES } from "./constants";
import { type TextAlign } from "./settings";
import { randomInt } from "./utils";

type TextOptions = {
    text: string;
    fontSize: number;
    textAlign: TextAlign;
};

type RectangleOptions = {
    x: number;
    y: number;
    width: number;
    height: number;
    className: string;
};

const lineHeight = 1.2;

const stripeHeight = 8;
const stripeSpacing = 12;
const minWidth = 30;
const maxWidth = 90;
const marginLeft = 12;
const marginBottom = 220;
const viewPortWidth = 1280;
const viewPortHeight = 720;
const stripesEnd = 180;
const minVisibleWidth = 20;

export class SvgBuilder {
    private readonly nameSpace = "http://www.w3.org/2000/svg";

    private readonly theme: SVGGraphicsElement;
    private readonly title: SVGTextElement;
    private readonly stripes: SVGElement;
    private readonly year: [SVGTextElement, SVGTextElement];
    private readonly location: SVGTextElement;

    constructor(private readonly element: SVGElement) {
        const theme = this.element.querySelector<SVGGeometryElement>(".theme");

        if (!theme) {
            throw new Error("Cannot find theme element");
        }

        this.theme = theme;

        const title = this.element.querySelector<SVGTextElement>(".title");

        if (!title) {
            throw new Error("Cannot find title element");
        }

        this.title = title;

        const stripes = this.element.querySelector<SVGElement>(".stripes");

        if (!stripes) {
            throw new Error("Cannot find stripes element");
        }

        this.stripes = stripes;

        const [left, right] =
            this.element.querySelectorAll<SVGTextElement>(".year");

        if (!left || !right) {
            throw new Error("Cannot find elements for the year");
        }

        this.year = [left, right];

        const location =
            this.element.querySelector<SVGTextElement>(".location");

        if (!location) {
            throw new Error("Cannot find title element");
        }

        this.location = location;
    }

    setTheme(newTheme: string) {
        THEMES.forEach((theme) => this.theme.classList.remove(theme));

        this.theme.classList.add(newTheme);

        return this;
    }

    setTitle(options: TextOptions) {
        const lines = options.text.split("\n");

        while (this.title.firstChild) {
            this.title.removeChild(this.title.firstChild);
        }

        switch (options.textAlign) {
            case "left":
                this.title.setAttribute("x", "320");
                this.title.setAttribute("text-anchor", "start");
                break;
            case "center":
                this.title.setAttribute("x", "730");
                this.title.setAttribute("text-anchor", "middle");
                break;
            case "right":
                this.title.setAttribute("x", "1180");
                this.title.setAttribute("text-anchor", "end");
                break;
        }

        const offsetFirst = ((1 - lines.length) / 2) * lineHeight;

        // Create a new tspan element for each line of input
        lines.forEach((line, index) => {
            const tspan = document.createElementNS(this.nameSpace, "tspan");

            tspan.textContent = line.trim() || "\u00a0";
            tspan.setAttribute("x", this.title.getAttribute("x")!);
            tspan.setAttribute(
                "dy",
                index > 0 ? `${lineHeight}em` : `${offsetFirst}em`,
            );

            this.title.appendChild(tspan);
        });

        this.title.setAttribute("font-size", `${options.fontSize}px`);

        return this;
    }

    setYear(year: number) {
        if (year < 2000 || year > 3000) {
            throw new Error("Year should be between 2000 and 3000");
        }

        this.year[0].textContent = year.toString().slice(0, 2);
        this.year[1].textContent = year.toString().slice(2, 4);

        return this;
    }

    setLocation(text: string) {
        this.location.textContent = text;

        return this;
    }

    injectFonts(rules: string[]) {
        const style = document.createElementNS(this.nameSpace, "style");

        style.setAttribute("type", "text/css");

        rules.forEach((rule) => {
            style.appendChild(document.createTextNode(rule));
        });

        this.element.insertBefore(style, this.element.firstChild);

        return this;
    }

    async createPngUri() {
        return new Promise<string>((resolve, reject) => {
            const img = new Image();

            img.addEventListener("load", () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d")!;

                // Устанавливаем размеры canvas
                canvas.width = viewPortWidth;
                canvas.height = viewPortHeight;

                // Рисуем SVG на canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0);

                // Преобразуем canvas в PNG-данные
                const pngData = canvas.toDataURL("image/png");

                resolve(pngData);
            });

            img.addEventListener("error", reject);

            img.src =
                "data:image/svg+xml," +
                encodeURIComponent(this.element.outerHTML);
        });
    }

    addStripes(classNames: string[]) {
        for (
            let y = marginBottom;
            y < viewPortHeight;
            y += stripeHeight + stripeSpacing
        ) {
            let x = marginLeft;
            let classNameIndex = randomInt(0, classNames.length);

            while (x < stripesEnd) {
                const stripeWidth = randomInt(minWidth, maxWidth);
                const visibleWidth =
                    stripeWidth + x < 0 ? stripeWidth + x : stripeWidth;

                classNameIndex = (classNameIndex + 1) % classNames.length;
                const className = `stripe ${classNames[classNameIndex]}`;

                if (visibleWidth >= minVisibleWidth) {
                    this.stripes.appendChild(
                        this.buildRect({
                            x,
                            y,
                            width: stripeWidth,
                            height: stripeHeight,
                            className: className,
                        }),
                    );
                }

                x += stripeWidth + stripeSpacing;
            }
        }

        return this;
    }

    protected buildRect({ x, y, width, height, className }: RectangleOptions) {
        const rect = document.createElementNS(this.nameSpace, "rect");

        rect.setAttribute("x", x.toString());
        rect.setAttribute("y", y.toString());
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("class", className);

        return rect;
    }
}
