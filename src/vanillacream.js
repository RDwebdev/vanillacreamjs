const VanillaCream = {};
VanillaCream.Info = {
    author: {
        name: "Riccardo Degni",
        website: "http://www.riccardodegni.com/",
    },
    version: "1.0.2",
    copyright: "Riccardo Degni",
    license: "MIT License",
    website: "http://www.riccardodegni.com/projects/vanillacreamjs",
};

VanillaCream.PrivateObj = {
    generateRandomString(length) {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    },

    generateUniqueRandomString(length) {
        const timestamp = new Date().getTime().toString(36);
        const randomPart = VanillaCream.PrivateObj.generateRandomString(
            length - timestamp.length
        );
        return timestamp + randomPart;
    },

    camelToHyphen(str) {
        return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    },

    selectorStorage: new Map(),

    select(selector) {
        return new VanillaCream.Elements(selector);
    },

    clearSelectorStorage() {
        VanillaCream.PrivateObj.selectorStorage.clear();
    },

    isState(obj) {
        return (
            obj &&
            typeof obj === "object" &&
            typeof obj._addWatcher === "function"
        );
    },

    getPropVal(el, key) {
        return VanillaCream.PrivateObj.collections.props.includes(key)
            ? el[key]
            : el.getAttribute(key);
    },

    fxStorage: new Map(),

    fxTimeoutMap: new WeakMap(),

    collections: {
        elements: [
            "Html",
            "Head",
            "Body",
            "Div",
            "Span",
            "Section",
            "Article",
            "Aside",
            "Header",
            "Footer",
            "Main",
            "Nav",
            "Address",

            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "P",
            "Blockquote",
            "Pre",
            "Hr",
            "Br",

            "Ul",
            "Ol",
            "Li",
            "Dl",
            "Dt",
            "Dd",

            "A",
            "Nav",

            "Img",
            "Picture",
            "Source",
            "Video",
            "Audio",
            "Track",
            "Canvas",
            "Svg",
            "Iframe",
            "Embed",
            "ObjectElement",

            "Form",
            "Input",
            "Textarea",
            "Button",
            "Select",
            "Option",
            "Optgroup",
            "Label",
            "Fieldset",
            "Legend",
            "Datalist",
            "Output",
            "Meter",
            "Progress",

            "Table",
            "Caption",
            "Thead",
            "Tbody",
            "Tfoot",
            "Tr",
            "Td",
            "Th",
            "Col",
            "Colgroup",

            "Script",
            "Noscript",
            "Style",
            "Link",
            "Meta",
            "Title",
            "Base",
            "Template",
            "Slot",
        ],

        events: [
            // Mouse
            "click",
            "dblclick",
            "mousedown",
            "mouseup",
            "mousemove",
            "mouseenter",
            "mouseleave",
            "mouseover",
            "mouseout",
            "contextmenu",

            // Touch / Pointer
            "touchstart",
            "touchmove",
            "touchend",
            "touchcancel",
            "pointerdown",
            "pointerup",
            "pointermove",
            "pointerenter",
            "pointerleave",
            "pointerover",
            "pointerout",
            "pointercancel",

            // Keyboard
            "keydown",
            "keypress",
            "keyup",

            // Input & Form
            "input",
            "change",
            "submit",
            "focus",
            "blur",
            "focusin",
            "focusout",
            "reset",
            "select",
            "selectstart",
            "copy",
            "cut",
            "paste",

            // Drag & drop
            "drag",
            "dragstart",
            "dragend",
            "dragenter",
            "dragleave",
            "dragover",
            "drop",

            // Scroll & resize
            "scroll",
            "resize",

            // Media
            "play",
            "pause",
            "ended",
            "volumechange",
            "timeupdate",
            "seeking",
            "seeked",
            "canplay",
            "canplaythrough",
            "loadeddata",
            "loadedmetadata",
            "loadstart",
            "progress",
            "stalled",
            "suspend",
            "waiting",

            // Window / Page
            "load",
            "unload",
            "beforeunload",
            "error",
            "resize",
            "hashchange",
            "popstate",

            // Animation & Transition
            "animationstart",
            "animationend",
            "animationiteration",
            "transitionstart",
            "transitionend",
            "transitionrun",
            "transitioncancel",

            // Visibility
            "visibilitychange",
        ],

        props: [
            "value",
            "checked",
            "selected",
            "disabled",
            "readonly",
            "indeterminate",
            "multiple",
            "selectedIndex",
            "files",
            "form",
            "type",
            "name",
            "src",
            "href",
            "tabIndex",
            "className",
        ],
    },
};

VanillaCream.Ajax = {
    async request(method, url, options = {}) {
        const { headers = {}, data = null, body = null } = options;
        const payload = data ?? body;

        const fetchOptions = {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                ...headers,
            },
        };

        if (payload && fetchOptions.method === "GET") {
            const query = new URLSearchParams(payload).toString();
            url += "?" + query;
        } else if (payload) {
            fetchOptions.body = JSON.stringify(payload);
        }

        const res = await fetch(url, fetchOptions);
        const contentType = res.headers.get("Content-Type");

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
        }

        if (contentType && contentType.includes("application/json")) {
            return await res.json();
        } else {
            return await res.text();
        }
    },

    async get(url, options = {}) {
        return this.request("GET", url, options);
    },

    async post(url, options = {}) {
        return this.request("POST", url, options);
    },

    async put(url, options = {}) {
        return this.request("PUT", url, options);
    },

    async patch(url, options = {}) {
        return this.request("PATCH", url, options);
    },

    async delete(url, options = {}) {
        return this.request("DELETE", url, options);
    },
};

VanillaCream.Elements = class {
    constructor(selector) {
        this.selectorStr = selector;

        if (typeof selector === "string") {
            this.selector = [...document.querySelectorAll(selector)];
        } else if (selector instanceof HTMLElement) {
            this.selector = [selector];
        } else if (selector instanceof NodeList || Array.isArray(selector)) {
            this.selector = [...selector];
        } else {
            console.warn("Invalid selector", selector);
            this.selector = [];
        }

        this.only = this.selector.length == 1;

        this._originalSelector = selector;
        this._originalContext = document;

        this.css = new Proxy(
            {},
            {
                get: (_, prop) => {
                    if (prop === "set") {
                        return (styles) => {
                            for (const key in styles) {
                                const value = styles[key];

                                if (
                                    typeof value === "function" &&
                                    this.__state__
                                ) {
                                    this.bindState(`css.${key}`, value);
                                } else {
                                    this._setFn(function () {
                                        this.style[key] = value;
                                    });
                                }
                            }
                            return this;
                        };
                    }

                    if (prop === "get") {
                        return (...props) => {
                            if (this.only) {
                                const computed = getComputedStyle(
                                    this.selector[0]
                                );
                                const result = {};
                                for (const p of props) result[p] = computed[p];
                                return result;
                            } else {
                                return this.selector.map((el) => {
                                    const computed = getComputedStyle(el);
                                    const result = {};
                                    for (const p of props)
                                        result[p] = computed[p];
                                    return result;
                                });
                            }
                        };
                    }

                    if (this.only)
                        return getComputedStyle(this.selector[0])[prop];
                    return this.selector.map(
                        (el) => getComputedStyle(el)[prop]
                    );
                },

                set: (_, prop, value) => {
                    if (typeof value === "function" && this.__state__) {
                        this.bindState(`css.${prop}`, value);
                    } else {
                        this._setFn(function () {
                            this.style[prop] = value;
                        });
                    }
                    return true;
                },
            }
        );

        this.attr = new Proxy(
            {},
            {
                get: (_, prop) => {
                    if (prop === "set") {
                        return (attrs) => {
                            for (const key in attrs) {
                                const value = attrs[key];

                                if (
                                    typeof value === "function" &&
                                    this.__state__
                                ) {
                                    this.bindState(`attr.${key}`, value);
                                } else {
                                    this._setFn(function () {
                                        if (
                                            VanillaCream.PrivateObj.collections.props.includes(
                                                key
                                            )
                                        ) {
                                            this[key] = value;
                                        } else {
                                            this.setAttribute(key, value);
                                        }
                                    });
                                }
                            }
                            return this;
                        };
                    }

                    if (prop === "get") {
                        return (...props) => {
                            return this.only
                                ? Object.fromEntries(
                                      props.map((p) => [
                                          p,
                                          VanillaCream.PrivateObj.getPropVal(
                                              this.selector[0],
                                              p
                                          ),
                                      ])
                                  )
                                : this.selector.map((el) =>
                                      Object.fromEntries(
                                          props.map((p) => [
                                              p,
                                              VanillaCream.PrivateObj.getPropVal(
                                                  el,
                                                  p
                                              ),
                                          ])
                                      )
                                  );
                        };
                    }

                    return this.only
                        ? VanillaCream.PrivateObj.getPropVal(
                              this.selector[0],
                              prop
                          )
                        : this.selector.map((el) =>
                              VanillaCream.PrivateObj.getPropVal(el, prop)
                          );
                },

                set: (_, prop, value) => {
                    if (typeof value === "function" && this.__state__) {
                        this.bindState(`attr.${prop}`, value);
                    } else {
                        this._setFn(function () {
                            if (
                                VanillaCream.PrivateObj.collections.props.includes(
                                    prop
                                )
                            ) {
                                this[prop] = value;
                            } else {
                                this.setAttribute(prop, value);
                            }
                        });
                    }
                    return true;
                },
            }
        );

        this.data = new Proxy(
            {},
            {
                get: (_, prop) => {
                    if (prop === "set") {
                        return (data) => {
                            for (const key in data) {
                                const value = data[key];

                                if (
                                    typeof value === "function" &&
                                    this.__state__
                                ) {
                                    this.bindState(`data.${key}`, value);
                                } else {
                                    this._setFn(function () {
                                        this.dataset[key] = value;
                                    });
                                }
                            }
                            return this;
                        };
                    }

                    if (prop === "get") {
                        return (...props) => {
                            if (this.only) {
                                const el = this.selector[0];
                                const result = {};
                                for (const p of props)
                                    result[p] = el.dataset[p];
                                return result;
                            } else {
                                return this.selector.map((el) => {
                                    const result = {};
                                    for (const p of props)
                                        result[p] = el.dataset[p];
                                    return result;
                                });
                            }
                        };
                    }

                    if (this.only) return this.selector[0].dataset[prop];
                    return this.selector.map((el) => el.dataset[prop]);
                },

                set: (_, prop, value) => {
                    if (typeof value === "function" && this.__state__) {
                        this.bindState(`data.${prop}`, value);
                    } else {
                        this._setFn(function () {
                            this.dataset[prop] = value;
                        });
                    }
                    return true;
                },
            }
        );

        this.classes = new Proxy(
            {},
            {
                get: (_, prop) => {
                    const normalize = (input) => {
                        if (typeof input === "string") {
                            return input.trim().split(/\s+/);
                        }
                        if (Array.isArray(input)) {
                            return input;
                        }
                        return [];
                    };

                    const applyClasses = (cls, fn) => {
                        const classes = normalize(cls);
                        this._setFn(function () {
                            classes.forEach((c) => this.classList[fn](c));
                        });
                        return this;
                    };

                    if (prop === "add") {
                        return (cls) => applyClasses(cls, "add");
                    }
                    if (prop === "remove") {
                        return (cls) => applyClasses(cls, "remove");
                    }
                    if (prop === "toggle") {
                        return (cls) => applyClasses(cls, "toggle");
                    }
                    if (prop === "has") {
                        return (...classes) => {
                            const norm = classes.flatMap(normalize);
                            if (this.only) {
                                return norm.every((cls) =>
                                    this.selector[0].classList.contains(cls)
                                );
                            } else {
                                return this.selector.map((el) =>
                                    norm.every((cls) =>
                                        el.classList.contains(cls)
                                    )
                                );
                            }
                        };
                    }
                    if (prop === "clear") {
                        return () => {
                            this._setFn(function () {
                                this.className = "";
                            });
                            return this;
                        };
                    }
                    if (prop === "all") {
                        return () => {
                            return this.only
                                ? this.selector[0].className
                                      .trim()
                                      .split(/\s+/)
                                      .filter(Boolean)
                                : this.selector.map((el) =>
                                      el.className
                                          .trim()
                                          .split(/\s+/)
                                          .filter(Boolean)
                                  );
                        };
                    }
                },
            }
        );

        Object.defineProperty(this, "class", {
            get() {
                return new Proxy(
                    {},
                    {
                        get: (_, className) => {
                            if (className === "set") {
                                return (classes) => {
                                    for (const key in classes) {
                                        const val = classes[key];

                                        if (
                                            typeof val === "function" &&
                                            this.__state__
                                        ) {
                                            this.bindState(`class.${key}`, val);
                                        } else {
                                            this._setFn(function () {
                                                this.classList.toggle(
                                                    key,
                                                    !!val
                                                );
                                            });
                                        }
                                    }
                                    return this;
                                };
                            }

                            if (this.only) {
                                return this.selector[0].classList.contains(
                                    className
                                );
                            } else {
                                return this.selector.map((el) =>
                                    el.classList.contains(className)
                                );
                            }
                        },

                        set: (_, className, value) => {
                            if (typeof value === "function" && this.__state__) {
                                this.bindState(`class.${className}`, value);
                            } else {
                                this._setFn(function () {
                                    this.classList.toggle(className, !!value);
                                });
                            }
                            return true;
                        },
                    }
                );
            },

            set(classObj) {
                for (const className in classObj) {
                    const value = classObj[className];

                    if (typeof value === "function" && this.__state__) {
                        this.bindState(`class.${className}`, value);
                    } else {
                        this._setFn(function () {
                            this.classList.toggle(className, !!value);
                        });
                    }
                }
            },
        });

        Object.defineProperty(this, "html", {
            get: () => {
                if (this.only) return this.selector[0].innerHTML;
                return this.selector.map((el) => el.innerHTML);
            },
            set: (val) => {
                if (typeof val === "function") {
                    this.bindState("html", val);
                    return;
                }

                if (Array.isArray(val)) {
                    this.html = "";
                    this.push(val);
                    return;
                }

                // string, numbers, ...
                this._setFn(function () {
                    this.innerHTML = val;
                });
            },
        });

        const textMappings = {
            text: "textContent",
            _text: "innerText",
        };

        for (const [apiName, domProp] of Object.entries(textMappings)) {
            Object.defineProperty(this, apiName, {
                get: () => {
                    if (this.only) return this.selector[0][domProp];
                    return this.selector.map((el) => el[domProp]);
                },
                set: (val) => {
                    // Function = computed reactive
                    if (typeof val === "function") {
                        if (this.__state__) {
                            this.bindState(apiName, val);
                            return;
                        }
                    }

                    // Array = safe concatenation in text
                    if (Array.isArray(val)) {
                        const joined = val
                            .map((v) => {
                                if (v instanceof VanillaCream.Elements)
                                    return v.dom[domProp];
                                if (v instanceof Node)
                                    return v.textContent || "";
                                if (typeof v === "string") return v;
                                return String(v);
                            })
                            .join("");

                        this._setFn(function () {
                            this[domProp] = joined;
                        });
                        return;
                    }

                    // Single value: string, number, etc.
                    this._setFn(function () {
                        this[domProp] = val;
                    });
                },
            });
        }
    }

    _setFn(fn, ...args) {
        this.selector.forEach((el) => {
            fn.apply(el, args);
        });
    }

    _getFn(fn, ...args) {
        const results = [];
        this.selector.forEach((el) => {
            results.push(fn.apply(el, args));
        });
        return results;
    }

    get dom() {
        return this.only ? this.selector[0] : this.selector;
    }

    on(event, handler, options = {}) {
        if (!this._vanillaCreamEventMap)
            this._vanillaCreamEventMap = new WeakMap();

        const add = (elDom, evt, fn) => {
            const vanillaCreamInstance = $(elDom);

            const wrapped = function (event) {
                const el = vanillaCreamInstance;
                fn.call(this, event, el);
            };

            elDom.addEventListener(evt, wrapped, options);

            if (!this._vanillaCreamEventMap.has(elDom)) {
                this._vanillaCreamEventMap.set(elDom, {});
            }
            const map = this._vanillaCreamEventMap.get(elDom);
            if (!map[evt]) map[evt] = [];
            map[evt].push(wrapped);
        };

        this.selector.forEach((el) => {
            if (typeof event === "object") {
                for (const evt in event) {
                    add(el, evt, event[evt]);
                }
            } else {
                add(el, event, handler);
            }
        });

        return this;
    }

    off(event, handler) {
        if (!this._vanillaCreamEventMap) return this;

        const remove = (el, evt, fn) => {
            el.removeEventListener(evt, fn);
        };

        this.selector.forEach((el) => {
            const map = this._vanillaCreamEventMap.get(el);
            if (!map) return;

            // off()
            if (!event) {
                for (const evt in map) {
                    map[evt].forEach((fn) => el.removeEventListener(evt, fn));
                }
                this._vanillaCreamEventMap.delete(el);
                return;
            }

            // off('click')
            if (event && !handler) {
                if (map[event]) {
                    map[event].forEach((fn) =>
                        el.removeEventListener(event, fn)
                    );
                    delete map[event];
                }
                return;
            }

            // off('click', handler)
            if (event && handler) {
                if (map[event]) {
                    map[event] = map[event].filter((fn) => {
                        if (fn === handler) {
                            el.removeEventListener(event, fn);
                            return false;
                        }
                        return true;
                    });
                    if (map[event].length === 0) delete map[event];
                }
            }
        });

        return this;
    }

    async load(method, url, options = {}, handlers = {}) {
        if (handlers.start) handlers.start();

        try {
            const data = await VanillaCream.Ajax.request(method, url, options);
            const html =
                typeof data === "string" ? data : JSON.stringify(data, null, 2);
            this.html = html;

            if (handlers.success) handlers.success(data);
            return data;
        } catch (err) {
            if (handlers.error) handlers.error(err);
            throw err;
        }
    }

    addChild(childOrCount, maybeFactory) {
        const normalizeToNode = (item) => {
            if (item instanceof VanillaCream.Elements) return item.dom;
            if (item instanceof Node) return item;
            if (typeof item === "string") {
                if (item.trim().startsWith("<")) {
                    const container = document.createElement("div");
                    container.innerHTML = item;
                    return [...container.childNodes];
                } else {
                    return document.createTextNode(item);
                }
            }
            return null;
        };

        const append = (child) => {
            const normalized = normalizeToNode(child);
            if (Array.isArray(normalized)) {
                normalized.forEach((n) => {
                    this._setFn(function () {
                        this.appendChild(n);
                    });
                });
            } else if (normalized) {
                this._setFn(function () {
                    this.appendChild(normalized);
                });
            }
        };

        if (
            typeof childOrCount === "number" &&
            typeof maybeFactory === "function"
        ) {
            for (let i = 0; i < childOrCount; i++) {
                append(maybeFactory(i));
            }
        } else if (
            Array.isArray(childOrCount) &&
            typeof maybeFactory === "function"
        ) {
            childOrCount.forEach((item, i) => append(maybeFactory(item, i)));
        } else if (Array.isArray(childOrCount)) {
            childOrCount.forEach((item) => append(item));
        } else {
            append(childOrCount);
        }

        return this;
    }

    fx(css, _opts = {}) {
        const k = JSON.stringify(css) + ":" + JSON.stringify(_opts);
        const animKey = JSON.stringify(k);

        if (!_opts.state) _opts.state = {};

        const callbacks = (el, animKey) => {
            const store = (VanillaCream.PrivateObj.fxTimeoutMap ??=
                new WeakMap());

            if (!store.has(el)) store.set(el, new Map());
            const animMap = store.get(el);

            const prevTimers = animMap.get(animKey);
            if (prevTimers) {
                if (prevTimers.start) clearTimeout(prevTimers.start);
                if (prevTimers.end) clearTimeout(prevTimers.end);
            }

            const timers = {};

            if (_opts.state.start) {
                timers.start = setTimeout(() => {
                    _opts.state.start();
                }, 10);
            }

            if (_opts.state.end) {
                timers.end = setTimeout(() => {
                    _opts.state.end();
                }, parseFloat(_opts.duration) * 1000);
            }

            animMap.set(animKey, timers);
        };

        // If animation already created → reuse class
        if (VanillaCream.PrivateObj.fxStorage.has(animKey)) {
            const cl = VanillaCream.PrivateObj.fxStorage.get(animKey);
            this._setFn(function () {
                this.classList.remove(cl);
                callbacks(this, animKey);
                setTimeout(() => this.classList.add(cl));
            });
            return this;
        }

        // Generating the new animation class
        const cl = VanillaCream.PrivateObj.generateUniqueRandomString(30);
        VanillaCream.PrivateObj.fxStorage.set(animKey, cl);

        const opts = {
            duration: _opts.duration ?? "3s",
            delay: _opts.delay ?? null,
            easing: _opts.easing ?? null,
            fillMode: _opts.fillMode ?? _opts["fill-mode"] ?? "forwards",
            iterationCount:
                _opts.iterationCount ?? _opts["iteration-count"] ?? null,
            state: {
                start: _opts.start ?? null,
                end: _opts.end ?? null,
            },
        };

        let optsStr = "";
        for (let key in opts) {
            if (key === "state") continue;
            if (opts[key]) optsStr += opts[key] + " ";
        }
        optsStr = optsStr.trim();

        let cssStr = `
		.${cl} {
			animation: VanillaCreamAnimation_${cl} ${optsStr};
		}
		@keyframes VanillaCreamAnimation_${cl} {
	`;

        for (let step in css) {
            const frame = ["from", "to"].includes(step) ? step : `${step}%`;
            cssStr += `\n${frame} {\n`;
            for (let prop in css[step]) {
                const hyphenProp = VanillaCream.PrivateObj.camelToHyphen(prop);
                cssStr += `  ${hyphenProp}: ${css[step][prop]};\n`;
            }
            cssStr += "}\n";
        }
        cssStr += "}";

        // Inject <style>
        const style = document.createElement("style");
        style.textContent = cssStr;
        document.head.appendChild(style);

        this._setFn(function () {
            callbacks(this, animKey);
            this.classList.add(cl);
        });

        return this;
    }

    query(selector) {
        const els = new VanillaCream.Elements(
            this.selector.flatMap((el) => [...el.querySelectorAll(selector)])
        );

        if (this.__state__) {
            els.setState(this.__state__);
        }

        return els;
    }

    // multi
    each(fn) {
        this.selector.forEach((el, i) => fn($(el), i));
        return this;
    }

    at(pos) {
        if (this.only) return this;
        switch (typeof pos) {
            case "number":
                const $el = $(this.selector[pos - 1]);
                if (this.__state__) {
                    $el.setState(this.__state__);
                }
                return $el;
            case "string":
                if (pos == "even") return this.filter(1, 2);
                if (pos == "odd") return this.filter(0, 2);
        }
        return this;
    }

    even() {
        return this.at("even");
    }

    odd() {
        return this.at("odd");
    }

    filter(start, increase) {
        if (this.only) return this;
        const els = [];
        for (let i = start; i < this.selector.length; i += increase) {
            els.push(this.selector[i]);
        }

        const $els = $(els);
        if (this.__state__) $els.setState(this.__state__);
        return $els;
    }

    static _defineProp(alias, realProp) {
        if (this.prototype.hasOwnProperty(alias)) return;
        Object.defineProperty(this.prototype, alias, {
            get() {
                if (this.only) {
                    return this.selector[0][realProp];
                }
                return this.selector.map((el) => el[realProp]);
            },
            set(value) {
                this.selector.forEach((el) => (el[realProp] = value));
            },
        });
    }
};

for (const evt of VanillaCream.PrivateObj.collections.events) {
    const methodName = "on" + evt.charAt(0).toUpperCase() + evt.slice(1);

    if (!VanillaCream.Elements.prototype.hasOwnProperty(methodName)) {
        VanillaCream.Elements.prototype[methodName] = function (
            fn,
            options = {}
        ) {
            return this.on(evt, fn, options);
        };
    }
}

Object.defineProperty(VanillaCream.Elements.prototype, "swap", {
    set(content) {
        let nodesToInsert = [];

        const normalizeNode = (entry) => {
            if (entry instanceof VanillaCream.Elements) {
                return entry.dom;
            } else if (
                entry instanceof HTMLElement ||
                entry instanceof Text ||
                entry instanceof DocumentFragment
            ) {
                return entry;
            } else if (typeof entry === "string") {
                if (entry.trim().startsWith("<")) {
                    const container = document.createElement("div");
                    container.innerHTML = entry;
                    return [...container.childNodes];
                } else {
                    return document.createTextNode(entry);
                }
            }
            return null;
        };

        if (Array.isArray(content)) {
            for (const item of content) {
                const normalized = normalizeNode(item);
                if (Array.isArray(normalized)) {
                    nodesToInsert.push(...normalized);
                } else if (normalized) {
                    nodesToInsert.push(normalized);
                }
            }
        } else {
            const normalized = normalizeNode(content);
            nodesToInsert = Array.isArray(normalized)
                ? normalized
                : [normalized];
        }

        this._setFn(function () {
            const parent = this.parentNode;
            nodesToInsert.forEach((node) => parent.insertBefore(node, this));
            this.remove();
        });
    },
});

VanillaCream.PrivateObj.collections.elements.forEach((selector, i) => {
    window[selector] = class {
        constructor(settings = {}) {
            this.selector = selector.toLowerCase();
            this.attr = settings.attr ?? false;
            this.data = settings.data ?? false;
            this.classes = settings.classes ?? false;
            this.class = settings.class ?? false;
            this.css = settings.css ?? false;
            this.html = settings.html ?? false;
            this.text = settings.text ?? false;
            this._text = settings._text ?? false;
            this.on = settings.on ?? false;
            this.onClick = settings.onClick ?? false;

            this.key = settings.key;

            this.state = settings.state ?? null;
            return this.make();
        }

        make() {
            const el = $(document.createElement(this.selector));
            el.dom.dataset.key = this.key;

            if (this.state) {
                el.setState(this.state);
            }

            if (this.attr) {
                if (typeof el.attr.set === "function") {
                    el.attr.set(this.attr);
                } else {
                    for (const key in this.attr) {
                        el.attr[key] = this.attr[key];
                    }
                }
            }

            if (this.data) {
                if (typeof el.data.set === "function") {
                    el.data.set(this.data);
                } else {
                    for (const key in this.data) {
                        el.data[key] = this.data[key];
                    }
                }
            }

            if (this.css) {
                if (typeof el.css.set === "function") {
                    el.css.set(this.css);
                } else {
                    for (const key in this.css) {
                        el.css[key] = this.css[key];
                    }
                }
            }

            if (this.class) {
                if (typeof el.class.set === "function") {
                    el.class.set(this.class);
                } else {
                    for (const cls in this.class) {
                        el.class[cls] = this.class[cls];
                    }
                }
            }

            if (this.classes) {
                el.classes.add(this.classes);
            }

            if (this.html) el.html = this.html;
            if (this.text) el.text = this.text;
            if (this._text) el._text = this._text;

            if (this.on) el.on(this.on);
            if (this.onClick) el.onClick(this.onClick);

            return el;
        }
    };
});

["get", "post", "put", "patch", "delete"].forEach((method) => {
    VanillaCream.Elements.prototype[method] = function (
        url,
        options = {},
        handlers = {}
    ) {
        return this.load(method, url, options, handlers);
    };
});

// aliases
[{ push: "addChild", find: "query" }].forEach((map) => {
    for (const k in map) {
        VanillaCream.Elements.prototype[k] =
            VanillaCream.Elements.prototype[map[k]];
    }
});

Object.defineProperty(Array.prototype, "each", {
    value: function (fn) {
        return this.forEach(fn);
    },
    enumerable: false,
});

// selecting / components
VanillaCream.Elements.prototype.component = function (Component, options = {}) {
    const data = options.data ?? Component.data ?? {};
    const state = Component.state ? $.state(Component.state()) : null;

    const html =
        typeof Component.template === "function"
            ? Component.template({ data })
            : Component.template;

    this.html = html;

    const refs = $.refs(this.selectorStr, state);

    Component.setup?.({ refs, data, state });

    $.component.bootstrap(this.selector[0]);

    return this;
};

function $(...args) {
    if (args.length === 1) return VanillaCream.PrivateObj.select(args[0]);

    const els = [];
    let _state_ = null;

    args.forEach((arg) => {
        if (typeof arg === "string") {
            els.push(VanillaCream.PrivateObj.select(arg));
        } else if (_state_ === null && typeof arg === "object") {
            _state_ = VanillaCream.PrivateObj.isState(arg) ? arg : $.state(arg);
        }
    });

    if (_state_) {
        els.forEach((el) => el.setState(_state_));
        return [...els, _state_];
    }

    return els;
}

function bindDataAttributes(container, state) {
    const stateAlias = container.getAttribute?.("data-state-val") || "state";

    const candidates = [container, ...container.querySelectorAll("*")].filter(
        (el) =>
            [...el.attributes].some(
                (a) =>
                    a.name.startsWith("x-") || a.name.startsWith("data-bind-")
            )
    );

    const bindables = candidates.filter((el) =>
        [...el.attributes].some(
            (a) => a.name.startsWith("x-") || a.name.startsWith("data-bind-")
        )
    );

    bindables.forEach((el) => {
        const $el = $(el);

        for (const attr of el.attributes) {
            const isBindAttr =
                attr.name.startsWith("data-bind-") ||
                attr.name.startsWith("x-");
            if (!isBindAttr) continue;

            const binding = attr.name
                .replace("data-bind-", "")
                .replace("x-", "");
            const expr = attr.value;

            // Assign state if not present
            if (!$el.__state__) {
                $el.__state__ = state;
                $el.bindState = VanillaCream.Elements.prototype.bindState;
            }

            // Events
            if (binding.startsWith("event.")) {
                const parts = binding.split(".");
                const eventName = parts[1];
                const modifiers = new Set(parts.slice(2));

                try {
                    const compiled = new Function(
                        stateAlias,
                        "event",
                        `
                        "use strict";
                        const result = (${expr});
                        return (typeof result === "function") ? result(event) : result;
                    `
                    );

                    const wrapped = function (e) {
                        if (modifiers.has("prevent")) e.preventDefault();
                        compiled(state, e);
                        if (modifiers.has("once")) {
                            el.removeEventListener(eventName, wrapped);
                        }
                    };

                    $el.on(eventName, wrapped);
                } catch (e) {
                    console.warn(
                        `Invalid event handler in [${attr.name}]`,
                        expr,
                        e
                    );
                }
                continue;
            }

            // x-if
            if (binding === "if") {
                const placeholder = document.createComment("x-if placeholder");
                const parent = el.parentNode;

                const computeFn = new Function(
                    stateAlias,
                    `return (${expr})`
                ).bind(null, state);
                let visible = null;

                const update = () => {
                    const shouldShow = !!computeFn();
                    if (shouldShow && visible === false) {
                        parent.insertBefore(el, placeholder);
                        placeholder.remove();
                        visible = true;
                    } else if (!shouldShow && visible !== false) {
                        parent.replaceChild(placeholder, el);
                        visible = false;
                    }
                };

                update();
                for (const key of Object.keys(state)) {
                    state._addWatcher(key, update);
                }
                continue;
            }

            // x-show
            if (binding === "show") {
                const computeFn = new Function(
                    stateAlias,
                    `return (${expr})`
                ).bind(null, state);
                $el.bindState("css.display", () => (computeFn() ? "" : "none"));
                continue;
            }

            // x-children
            if (binding === "children") {
                try {
                    const computeFn = new Function(
                        stateAlias,
                        `return (${expr})`
                    ).bind(null, state);
                    $el.bindState("children", computeFn);
                } catch (e) {
                    console.warn(
                        `Invalid binding expression in [${attr.name}]`,
                        expr,
                        e
                    );
                }
                continue;
            }

            // Other bindings
            try {
                // x-class
                if (
                    binding === "class" &&
                    expr.trim().startsWith("{") &&
                    expr.trim().endsWith("}")
                ) {
                    const parsed = new Function(stateAlias, `return (${expr})`)(
                        state
                    );

                    for (const key in parsed) {
                        const val = parsed[key];
                        const fn = typeof val === "function" ? val : () => val;
                        $el.bindState(`class.${key}`, fn);
                    }
                }
                // x-attr
                else if (
                    binding === "attr" &&
                    expr.trim().startsWith("{") &&
                    expr.trim().endsWith("}")
                ) {
                    const parsed = new Function(stateAlias, `return (${expr})`)(
                        state
                    );

                    for (const key in parsed) {
                        const val = parsed[key];
                        const fn = typeof val === "function" ? val : () => val;
                        $el.bindState(`attr.${key}`, fn);
                    }
                }
                // x-css
                else if (
                    binding === "css" &&
                    expr.trim().startsWith("{") &&
                    expr.trim().endsWith("}")
                ) {
                    const parsed = new Function(stateAlias, `return (${expr})`)(
                        state
                    );

                    for (const key in parsed) {
                        const val = parsed[key];
                        const fn = typeof val === "function" ? val : () => val;
                        $el.bindState(`css.${key}`, fn);
                    }
                }
                // x-data
                else if (
                    binding === "data" &&
                    expr.trim().startsWith("{") &&
                    expr.trim().endsWith("}")
                ) {
                    const parsed = new Function(stateAlias, `return (${expr})`)(
                        state
                    );
                    log("eeher");

                    for (const key in parsed) {
                        const val = parsed[key];
                        const fn = typeof val === "function" ? val : () => val;
                        $el.bindState(`data.${key}`, fn);
                    }
                }
                // others
                else {
                    const computeFn = new Function(
                        stateAlias,
                        `return (${expr})`
                    ).bind(null, state);
                    $el.bindState(binding, computeFn);
                }
            } catch (e) {
                console.warn(
                    `Invalid binding expression in [${attr.name}]`,
                    expr,
                    e
                );
            }
        }
    });
}

$.refs = function (root, initialState = null) {
    const container =
        typeof root === "string"
            ? document.querySelector(root)
            : root instanceof HTMLElement
            ? root
            : null;

    const elements = container.querySelectorAll("[ref]");
    const result = {};

    const state = initialState
        ? VanillaCream.PrivateObj.isState(initialState)
            ? initialState
            : $.state(initialState)
        : null;

    elements.forEach((el) => {
        const $el = $(el);

        if (state) {
            $el.__state__ = state;
            $el.bindState = VanillaCream.Elements.prototype.bindState;
        }

        const path = el.getAttribute("ref").split(".");
        let target = result;

        for (let i = 0; i < path.length - 1; i++) {
            target[path[i]] ??= {};
            target = target[path[i]];
        }

        target[path.at(-1)] = $el;
    });

    if (state) {
        result.state = state;
        bindDataAttributes(container, state);
    }

    return result;
};

$.component = {
    registry: {},

    register(name, def) {
        this.registry[name] = def;
    },

    bootstrap(root = document) {
        root.querySelectorAll("[data-component]").forEach((el) => {
            const name = el.getAttribute("data-component");
            const def = this.registry[name];
            if (!def) {
                console.warn(`Component "${name}" non registrato.`);
                return;
            }

            const data = Object.fromEntries(
                [...el.attributes]
                    .filter(
                        (attr) =>
                            attr.name.startsWith("data-") &&
                            attr.name !== "data-component"
                    )
                    .map((attr) => [
                        attr.name.replace(/^data-/, ""),
                        attr.value,
                    ])
            );

            $(el).component(def, { data });
        });
    },
};

// state
VanillaCream.Elements.prototype.setState = function (_state_) {
    if (_state_) {
        this.__state__ = _state_;
        this.bindState = VanillaCream.Elements.prototype.bindState;
    }
    return this;
};

VanillaCream.Elements.prototype.bindState = function (targets, computeFn) {
    const targetList = Array.isArray(targets) ? targets : [targets];

    if (targetList.length === 1 && targetList[0] === "children") {
        const updateChildren = () => {
            const value = computeFn();
            this.children = value;
        };

        updateChildren();

        if (this.__state__) {
            for (const key of Object.keys(this.__state__)) {
                this.__state__._addWatcher(key, updateChildren);
            }
        }

        return this;
    }

    const update = () => {
        const value = computeFn();

        for (const target of targetList) {
            let ctx = this;
            let prop = target;
            let namespace = null;

            if (target.includes(".")) {
                [namespace, prop] = target.split(".");

                switch (namespace) {
                    case "attr":
                        ctx = this.attr;
                        break;
                    case "data":
                        ctx = this.data;
                        break;
                    case "css":
                        ctx = this.css;
                        break;
                    case "class":
                    case "classes":
                        ctx = this.classes;
                        break;
                    default:
                        console.warn(
                            `VanillaCream.bindState(): invalid namespace "${namespace}"`
                        );
                        return;
                }
            } else {
                ctx = this;
                prop = target;
            }

            if (namespace === "class" || namespace === "classes") {
                if (value) ctx.add(prop);
                else ctx.remove(prop);
            } else if (namespace === "css") {
                ctx.set({ [prop]: value });
            } else {
                ctx[prop] = value;
            }
        }
    };

    update();

    const deps = new Set();
    const proxy = new Proxy(
        {},
        {
            get(_, prop) {
                deps.add(prop);
                return () => computeFn();
            },
        }
    );

    try {
        computeFn(proxy);
    } catch {}

    for (const dep of Object.keys(this.__state__ ?? {})) {
        this.__state__._addWatcher(dep, update);
    }

    return this;
};

$.state = function (obj) {
    const watchers = new Map();

    const notify = (key, value) => {
        if (watchers.has(key)) {
            for (const fn of watchers.get(key)) {
                fn(value);
            }
        }
    };

    const wrap = (value, parentKey) => {
        if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
                return new Proxy(value, {
                    set(target, prop, val) {
                        target[prop] = val;
                        notify(parentKey, target); // Notification for changed array
                        return true;
                    },
                    get(target, prop, receiver) {
                        const item = Reflect.get(target, prop, receiver);
                        // If I access item array like arr[2] which is another array/object
                        return wrap(item, parentKey);
                    },
                });
            } else {
                return new Proxy(value, {
                    set(target, prop, val) {
                        target[prop] = val;
                        notify(parentKey, target); // Notification on parentKey
                        return true;
                    },
                    get(target, prop, receiver) {
                        const val = Reflect.get(target, prop, receiver);
                        return wrap(val, parentKey); // Recursive depth
                    },
                });
            }
        }
        return value;
    };

    const proxy = new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value;
            notify(prop, value);
            return true;
        },
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            return wrap(value, prop); // Reactive even for nested accesses
        },
    });

    proxy._watchers = watchers;
    proxy._addWatcher = function (key, fn) {
        if (!watchers.has(key)) watchers.set(key, []);
        watchers.get(key).push(fn);
    };

    return proxy;
};

$.watch = function (fn, state, keys) {
    const props = Array.isArray(keys) ? keys : [keys];

    for (const key of props) {
        state._addWatcher(key, fn);
    }
};

// ajax
$.ajax = function (method, url, options = {}) {
    return VanillaCream.Ajax.request(method, url, options);
};

["get", "post", "put", "patch", "delete"].forEach((method) => {
    $[method] = (url, options = {}) => $.ajax(method, url, options);
});

Object.defineProperty(VanillaCream.Elements.prototype, "children", {
    get() {
        return [...this.dom.children].map((child) => $(child));
    },

    set(value) {
        const container = this.dom;
        const self = this;

        const getKey = (el) =>
            el?.dataset?.key || el?.getAttribute?.("key") || el?.id;

        const normalize = (arr) => {
            if (!Array.isArray(arr)) return [];

            const nodes = [];

            for (const item of arr) {
                const node =
                    item instanceof VanillaCream.Elements ? item.dom : item;
                const key = getKey(node);

                if (!key) {
                    console.warn(
                        "Each item in children must have a key or data-key:",
                        node
                    );
                    continue;
                }

                nodes.push({ key, node });
            }

            return nodes;
        };

        const update = (newNodesRaw) => {
            const newNodes = normalize(newNodesRaw);
            const newMap = new Map(
                newNodes.map(({ key, node }) => [key, node])
            );
            const existing = [...container.childNodes];
            const existingMap = new Map();

            for (const el of existing) {
                const key = getKey(el);
                if (key) existingMap.set(key, el);
            }

            // Insert or move nodes
            newNodes.forEach(({ key, node }, i) => {
                const refNode = container.childNodes[i];
                const existingNode = existingMap.get(key);

                if (existingNode && existingNode !== refNode) {
                    container.insertBefore(existingNode, refNode || null);
                } else if (!existingNode) {
                    container.insertBefore(node, refNode || null);
                }
            });

            // Remove outdated
            existing.forEach((child) => {
                const key = getKey(child);
                if (!newMap.has(key)) {
                    child.remove();
                }
            });
        };

        // If it is a function (programmatic assignment), we keep the reactive behavior
        if (typeof value === "function") {
            const run = () => update(value());
            run();

            const state = self.__state__;
            if (state && typeof state._addWatcher === "function") {
                for (const key of Object.keys(state)) {
                    state._addWatcher(key, run);
                }
            }
        } else {
            // Otherwise it's an array (as in x-children="..."), update immediately
            update(value);
        }
    },
});

function log(...args) {
    console.log.apply(window, args);
}
function onMount(fn) {
    window.addEventListener("DOMContentLoaded", fn);
}

// on mounting
onMount(() => {
    $.component.bootstrap();
});

onMount(() => {
    const debounceTimers = new WeakMap();
    const intervalHandles = new WeakMap();
    const onceFired = new WeakSet();

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el._VanillaCream.AjaxHandler) {
                        el._VanillaCream.AjaxHandler();
                        if (el._VanillaCream.AjaxOnce) observer.unobserve(el);
                    }
                }
            }
        },
        {
            threshold: 0.1,
        }
    );

    function parseJsObjectString(str) {
        try {
            return new Function(`return (${str})`)();
        } catch (e) {
            console.warn("data-ajax parsing error:", e);
            return null;
        }
    }

    function handleAjaxResponse(el, data, target, action) {
        const output =
            typeof data === "string" ? data : JSON.stringify(data, null, 2);
        target[action] = output;
    }

    function resolveDynamicValues(data, $el) {
        const resolved = {};

        for (const key in data) {
            const value = data[key];

            if (typeof value === "string" && value.startsWith("@")) {
                const parts = value.slice(1).split(".");

                const selectorStr = parts[0];
                const namespace = parts[1];
                const prop = parts[2];

                const sel = selectorStr === "this" ? $el : $(selectorStr);

                if (!sel) {
                    console.warn(`Selector '${selectorStr}' not found`);
                    resolved[key] = null;
                    continue;
                }

                switch (namespace) {
                    case "attr":
                        resolved[key] = sel.attr[prop];
                        break;
                    case "data":
                        resolved[key] = sel.data[prop];
                        break;
                    case "css":
                        resolved[key] = sel.css[prop];
                        break;
                    case "class":
                        resolved[key] = sel.class[prop];
                        break;
                    case "text":
                    case "_text":
                    case "html":
                        resolved[key] = sel[namespace];
                        break;
                    default:
                        console.warn(
                            `Unknown namespace '${namespace}' in '${value}'`
                        );
                        resolved[key] = null;
                        break;
                }
            } else {
                resolved[key] = value;
            }
        }

        return resolved;
    }

    ["get", "post", "put", "patch", "delete"].forEach((method) => {
        document.querySelectorAll(`[data-ajax-${method}]`).forEach((dom) => {
            const raw = dom.getAttribute(`data-ajax-${method}`);
            const config = parseJsObjectString(raw);
            if (!config || !config.url) return;

            if (config.resp == undefined) config.resp = "this.html";

            const [targetSel, action] = config.resp.split(".");
            const $el = $(dom);
            const target = targetSel === "this" ? $el : $(targetSel);

            const trigger = config.on ?? "load";
            const delay = (config.delay ?? 0) * 1000;

            const performRequest = () => {
                if (onceFired.has(dom)) return;

                if (config.confirm && !window.confirm(config.confirm)) return;

                if (config.beforeStart) target.html = config.beforeStart;

                setTimeout(async () => {
                    try {
                        if (config.start) target.html = config.start;

                        const res = await $.ajax(method, config.url, {
                            ...(config.data
                                ? {
                                      data: resolveDynamicValues(
                                          config.data,
                                          $el
                                      ),
                                  }
                                : {}),
                            ...(config.headers
                                ? { headers: config.headers }
                                : {}),
                            ...(config.type ? { type: config.type } : {}),
                        });

                        if (res && res.stopEvery && intervalHandles.has(dom)) {
                            clearInterval(intervalHandles.get(dom));
                            intervalHandles.delete(dom);
                        }

                        if (config.resp) {
                            handleAjaxResponse($el, res, target, action);
                        }

                        if (config.once) onceFired.add(dom);
                    } catch (err) {
                        console.error("Request error:", err);
                    }
                }, delay);
            };

            const debouncedHandler = () => {
                const wait = (config.debounce ?? 0) * 1000;

                if (wait > 0) {
                    clearTimeout(debounceTimers.get(dom));
                    const timer = setTimeout(() => {
                        performRequest();
                    }, wait);
                    debounceTimers.set(dom, timer);
                } else {
                    performRequest();
                }
            };

            if (trigger === "load") {
                performRequest();

                if (config.every) {
                    const interval = parseFloat(config.every) * 1000;
                    const handle = setInterval(performRequest, interval);
                    intervalHandles.set(dom, handle);
                }
            } else if (trigger === "revealed") {
                const once = config.once ?? true;

                if (!dom._VanillaCream) dom._VanillaCream = {};

                dom._VanillaCream.AjaxHandler = () => {
                    performRequest();

                    if (config.every) {
                        const interval = parseFloat(config.every) * 1000;
                        const handle = setInterval(performRequest, interval);
                        intervalHandles.set(dom, handle);
                    }
                };
                dom._VanillaCream.AjaxOnce = once;
                observer.observe(dom);
            } else {
                dom.addEventListener(trigger, () => {
                    if (config.once && onceFired.has(dom)) return;

                    debouncedHandler();

                    if (config.once) onceFired.add(dom);
                });
            }
        });
    });
});

onMount(() => {
    const all = document.querySelectorAll("[data-bind-state], [x-state]");

    all.forEach((el) => {
        const isData = el.hasAttribute("data-bind-state");
        const isX = el.hasAttribute("x-state");

        const id = el.id;
        if (!id) {
            console.warn(
                "Element with [data-bind-state] or [x-state] must have an ID"
            );
            return;
        }

        const stateStr = isData
            ? el.getAttribute("data-bind-state")
            : el.getAttribute("x-state");

        const alias = el.getAttribute("data-state-val") || "state";

        let parsedState = {};
        try {
            parsedState = new Function(`return (${stateStr})`)();
        } catch (err) {
            console.warn(
                `Invalid object in ${
                    isData ? "data-bind-state" : "x-state"
                } on #${id}`,
                err
            );
            return;
        }

        const refs = $.refs(`#${id}`, parsedState);
        window[alias] = refs.state;
    });
});
