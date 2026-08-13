// Shared inline syntax-highlight tokens for the hand-styled Go/JSON code
// blocks scattered across the profile components — not a real tokenizer,
// just consistent coloring for hand-written snippets.

export const Cm = ({ children }) => (
  <span className="text-term-silver-dim italic">{children}</span>
);
export const Kw = ({ children }) => <span className="text-term-blue">{children}</span>;
export const Ty = ({ children }) => <span className="text-term-gold">{children}</span>;
export const Str = ({ children }) => <span className="text-term-green">{children}</span>;
export const Tag = ({ children }) => <span className="text-term-silver">{children}</span>;
export const Pu = ({ children }) => <span className="text-term-silver">{children}</span>;

// `[]string{"a", "b"}` — the repeated shape behind most of the hand-styled
// Go snippets across the profile/resume components.
export function List({ items }) {
  return (
    <>
      <Ty>[]string</Ty>
      <Pu>{"{"}</Pu>
      {items.map((item, i) => (
        <span key={item}>
          <Str>&quot;{item}&quot;</Str>
          {i < items.length - 1 ? ", " : ""}
        </span>
      ))}
      <Pu>{"}"}</Pu>
    </>
  );
}

// `\n\n// heading\n<children>` — groups a block under a comment header, the
// same visual convention the class/enum groupings use in the reference design.
export function Section({ heading, children }) {
  return (
    <>
      {"\n\n"}
      <Cm>{`// ${heading}`}</Cm>
      {"\n"}
      {children}
    </>
  );
}
