const EVENTS = {
  CLICK_FOCUS: "on-node-click-focus",
  CLICK_REF: "on-node-click-ref",
  MOUSEOUT: "on-node-mouseout",
  MOUSEOVER: "on-node-mouseover",
};

function createListener(handler, data) {
  if (typeof handler === "function") {
    return function (e) {
      // if (e.target.className.indexOf("org-tree-node-btn") > -1) return;
      // eslint-disable-next-line no-useless-call
      handler.apply(null, [e, data]);
    };
  }
}

const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0);
};

export function renderNode(h, data, context) {
  const { props } = context;
  const cls = ["org-tree-node"];
  const childNodes = [];
  const children = data[props.props.children];

  if (isLeaf(data, props.props.children)) {
    cls.push("is-leaf");
  }

  childNodes.push(renderLabel(h, data, context));

  if (data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context));
  }

  return h(
    "div",
    {
      domProps: {
        className: cls.join(" "),
      },
    },
    childNodes
  );
}

export function renderLabel(h, data, context) {
  const { props, listeners } = context;
  const label = data[props.props.label];
  const renderContent = props.renderContent;

  // event handlers
  const clickFocusHandler = listeners[EVENTS.CLICK_FOCUS];
  const clickRefHandler = listeners[EVENTS.CLICK_REF];
  const mouseOutHandler = listeners[EVENTS.MOUSEOUT];
  const mouseOverHandler = listeners[EVENTS.MOUSEOVER];

  const childNodes = [];
  if (typeof renderContent === "function") {
    const vnode = renderContent(h, data);

    vnode && childNodes.push(vnode);
  } else {
    childNodes.push(label);
  }

  const cls = ["org-tree-node-label-inner"];
  const {
    labelColor,
    refLabelColor,
    selectedKey,
    labelSelectedColor,
    vertical,
  } = props;
  let { labelWidth, refLabelWidth, labelClassName, selectedClassName } = props;

  if (!data.isLeaf && !data.refSelected && !vertical) {
    childNodes.push(
      h("span", {
        domProps: {
          className: "org-tree-node-btn",
        },
      })
    );
  }
  if (typeof labelWidth === "number") {
    labelWidth += "px";
  }
  if (typeof refLabelWidth === "number") {
    refLabelWidth += "px";
  }

  if (typeof labelClassName === "function") {
    labelClassName = labelClassName(data);
  }

  labelClassName && cls.push(labelClassName);

  // add selected class and key from props
  if (typeof selectedClassName === "function") {
    selectedClassName = selectedClassName(data);
  }

  selectedClassName &&
    selectedKey &&
    data[selectedKey] &&
    cls.push(selectedClassName);

  // data.focusSelected && cls.push('focused')

  return h(
    "div",
    {
      domProps: {
        className: "org-tree-node-label",
      },
    },
    [
      h(
        "div",
        {
          domProps: {
            className: cls.join(" "),
          },
          style: {
            width: labelWidth,
            backgroundColor: data.focusSelected
              ? labelSelectedColor
              : labelColor,
            filter: data.focusSelected && vertical ? "invert()" : "none",
          },
          on: {
            dblclick: createListener(clickRefHandler, data),
            click: createListener(clickFocusHandler, data),
            mouseout: createListener(mouseOutHandler, data),
            mouseover: createListener(mouseOverHandler, data),
          },
        },
        childNodes
      ),
      /* data.isLeaf || */ vertical
        ? ""
        : h("span", {
            domProps: {
              className: `org-tree-node-btn-ref ${
                data.refSelected && "referenced"
              }`,
            },
            style: {
              width: refLabelWidth,
              backgroundColor: data.isLeaf ? "#BDBDBD" : refLabelColor,
            },
            on: {
              click: createListener(clickRefHandler, data),
            },
          }),
    ]
  );
}

export function renderChildren(h, list, context) {
  if (Array.isArray(list) && list.length) {
    const children = list.map((item) => {
      if (item.hide) return "";
      return renderNode(h, item, context);
    });

    return h(
      "div",
      {
        domProps: {
          className: "org-tree-node-children",
        },
      },
      children
    );
  }
  return "";
}

export function render(h, context) {
  const { props } = context;

  return renderNode(h, props.data, context);
}

export default render;
