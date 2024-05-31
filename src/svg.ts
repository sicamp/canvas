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

const stripeHeight = 12;
const stripeSpacing = 18;
const minWidth = 40;
const maxWidth = 160;
const marginTop = 18;
const marginBottom = 602;
const viewBoxWidth = 1280;
const minVisibleWidth = 20;

export class SvgBuilder {
    private readonly nameSpace = "http://www.w3.org/2000/svg";

    private readonly background: SVGGeometryElement;
    private readonly title: SVGTextElement;
    private readonly stripes: SVGElement;

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

            tspan.textContent = line;
            tspan.setAttribute("x", this.title.getAttribute("x")!);
            tspan.setAttribute(
                "dy",
                index > 0 ? `${lineHeight}em` : `${offsetFirst}em`,
            );
            tspan.textContent = line;

            this.title.appendChild(tspan);
        });

        this.title.setAttribute("fill", options.color);
        this.title.setAttribute("font-size", `${options.fontSize}px`);

        return this;
    }

    addStripes(colors: string[]) {
        this.fillStripeSection(marginTop, marginTop + 100, colors);
        this.fillStripeSection(marginBottom, marginBottom + 100, colors);

        return this;
    }

    protected fillStripeSection(
        yStart: number,
        yEnd: number,
        colors: string[],
    ) {
        let colorIndex = 0;
        for (let y = yStart; y < yEnd; y += stripeHeight + stripeSpacing) {
            colorIndex = (colorIndex + 1) % colors.length;

            let x = -maxWidth; // Start from left side, stripes may overflow

            while (x < viewBoxWidth) {
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
