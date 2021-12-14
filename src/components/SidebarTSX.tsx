
      {() => {
        let generate = (input) => {
          let _keys = Object.keys(input)
          .sort((a, b) => {
            return a == "index" ? -1 : b == "index" ? 1 : 0;
          });

          return _keys.map(item => {
            let props = {
               item,
               details: input[item],
               content: generate(input[item])
            };
            return (<SidebarSection item={item} details={input[item]} content={generate(input[item])} />);

          });
        };

        return generate(obj);
      }}