type TextOptions = {
    text: string;
    color: string;
    fontSize: number;
};

const lineHeight = 1.2;

export class SvgBuilder {
    private readonly nameSpace = "http://www.w3.org/2000/svg";

    private readonly background: SVGGeometryElement;
    private readonly title: SVGTextElement;

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
}
