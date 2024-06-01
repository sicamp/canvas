const FONT_NAME = "Jost";
const FONT_STYLE = "normal";
const FONT_WEIGHT = 700;
const FONT_DISPLAY = "swap";

const fonts = [
    /* cyrillic */
    {
        src: "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7mxEIjVFNI4un_HKOEp-Cw.woff",
        unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
    },
    /* latin-ext */
    {
        src: "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7mxEIjVPNI4un_HKOEp-Cw.woff",
        unicodeRange:
            "U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
    /* latin */
    {
        src: "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7mxEIjVBNI4un_HKOEo.woff",
        unicodeRange:
            "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
];

function getDataUriForFont(fontUrl: string) {
    return new Promise<string>((resolve, reject) => {
        fetch(fontUrl)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const base64 = btoa(
                    new Uint8Array(buffer).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        "",
                    ),
                );
                resolve(`data:application/font-woff;base64,${base64}`);
            })
            .catch(reject);
    });
}

export async function getFontsRules() {
    const sources = await Promise.allSettled(
        fonts.map((font) => getDataUriForFont(font.src)),
    );

    return sources.map((source, index) => {
        if (source.status !== "fulfilled") {
            return "";
        }

        return `@font-face {
            font-family: "${FONT_NAME}";
            font-style: ${FONT_STYLE};
            font-weight: ${FONT_WEIGHT};
            font-display: ${FONT_DISPLAY};
            src: url('${source.value}') format('woff');
            unicode-range: ${fonts[index].unicodeRange};
        }`;
    });
}
