import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const FormInputWrapper = ({ children, error, className }: Props) => {
  return (
    <div className={clsx(className ? className : "w-full mx-auto flex flex-col gap-1 transition-all")}>
      {children}
      {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
    </div>
  );
};