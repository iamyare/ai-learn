
export const H1 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="text-2xl font-bold my-4" {...props}>{children}</h1>
)

export const H2 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="text-xl font-semibold my-3" {...props}>{children}</h2>
)

export const H3 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className="text-lg font-medium my-2" {...props}>{children}</h3>
)