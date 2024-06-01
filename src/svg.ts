import { randomInt } from "./utils";

type TextOptions = {
    text: string;
    color: string;
    fontSize: number;
};

type RectangleOptions = {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};

const lineHeight = 1.2;

const stripeHeight = 8;
const stripeSpacing = 12;
const minWidth = 30;
const maxWidth = 90;
const marginLeft = 12;
const marginBottom = 220;
const viewPortHeight = 1280;
const stripesEnd = 180;
const minVisibleWidth = 20;

export class SvgBuilder {
    private readonly nameSpace = "http://www.w3.org/2000/svg";

    private readonly background: SVGGeometryElement;
    private readonly title: SVGTextElement;
    private readonly stripes: SVGElement;
    private readonly year: [SVGTextElement, SVGTextElement];
    private readonly location: SVGTextElement;

    constructor(private readonly element: SVGElement) {
        const background =
            this.element.querySelector<SVGGeometryElement>(".background");

        if (!background) {
            throw new Error("Cannot find background element");
        }

        this.background = background;

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

    setBackground(color: string) {
        this.background.setAttribute("fill", color);

        return this;
    }

    setTitle(options: TextOptions) {
        const lines = options.text.split("\n");

        while (this.title.firstChild) {
            this.title.removeChild(this.title.firstChild);
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

        this.title.setAttribute("fill", options.color);
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

    addStripes(colors: string[]) {
        for (
            let y = marginBottom;
            y < viewPortHeight;
            y += stripeHeight + stripeSpacing
        ) {
            let x = marginLeft;
            let colorIndex = randomInt(0, colors.length);

            while (x < stripesEnd) {
                const stripeWidth = randomInt(minWidth, maxWidth);
                const visibleWidth =
                    stripeWidth + x < 0 ? stripeWidth + x : stripeWidth;

                colorIndex = (colorIndex + 1) % colors.length;
                const stripeColor = colors[colorIndex];

                if (visibleWidth >= minVisibleWidth) {
                    this.stripes.appendChild(
                        this.buildRect({
                            x,
                            y,
                            width: stripeWidth,
                            height: stripeHeight,
                            color: stripeColor,
                        }),
                    );
                }

                x += stripeWidth + stripeSpacing;
            }
        }

        return this;
    }

    protected buildRect({ x, y, width, height, color }: RectangleOptions) {
        const rect = document.createElementNS(this.nameSpace, "rect");

        rect.setAttribute("x", x.toString());
        rect.setAttribute("y", y.toString());
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("fill", color);

        return rect;
    }
}
