import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";

type Props = {
  children: React.ReactNode;
};

export const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <Header />
      <div className="w-full p-4 pt-24">{children}</div>
    </div>
  );
};
