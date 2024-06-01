export function download(name: string, content: string) {
    const downloadLink = document.createElement("a");
    downloadLink.href = content;
    downloadLink.download = name;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
