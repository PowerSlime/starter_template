import "dom4";

import * as $ from "jquery/dist/jquery";

window.$ = $;
window.jQuery = $;

import svgPolyfill from "svg4everybody/dist/svg4everybody";
import isMac from "./components/is-mac";
import "retinajs/dist/retina";

svgPolyfill();

$(document).ready(function () {
    isMac();
});
