export default function () {
    const isMac = !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);

    if (isMac) {
        document.querySelector("html").classList.add("is-mac");
    }
};
