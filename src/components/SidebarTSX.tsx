async () => {
  function isObject(obj) {
    return typeof obj === "object" && obj !== null && obj !== undefined;
  }

  // Capitalize first letter of each word
  let capitalize = (str) => {
    return str
      .replace(/-/g, " ")
      .replace(/\w\S*/g, function (txt) {
        return (
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      })
      .replace(/api/gi, "API")
      .replace(/css/gi, "CSS");
  };

  let generate = (input) => {
    let _keys = Object.keys(input).sort((a, b) => {
      return a == "index" ? -1 : b == "index" ? 1 : 0;
    });

    return Promise.all(
      _keys.map((item) => {
        let props = {
          item,
          details: input[item],
          content: generate(input[item]),
        };

        return isObject(props.details) ? (
          <details>
            <summary>
              <p>
                {[
                  "animate",
                  "emitter",
                  "manager",
                  "native",
                ].includes(item)
                  ? `@okikio/${item}`
                  : capitalize(item)}
              </p>
            </summary>

            <div class="content">{props.content}</div>
          </details>
        ) : (
          <a href={props.details}>
            {item == "index" ? "Overview" : capitalize(item)}
          </a>
        );
      })
    );
  };

  return await generate(obj);
}



function keyIteration(item) {
  let props = {
    item,
    details: input[item],
    content: generate(input[item]),
  };

  return isObject(props.details) ? (
    <details>
      <summary>
        <p>
          {[
            "animate",
            "emitter",
            "manager",
            "native",
          ].includes(item)
            ? `@okikio/${item}`
            : capitalize(item)}
        </p>
      </summary>

      <div class="content">{props.content}</div>
    </details>
  ) : (
    <a href={props.details}>
      {item == "index" ? "Overview" : capitalize(item)}
    </a>
  );
}