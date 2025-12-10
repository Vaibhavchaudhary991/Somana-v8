import { Button } from "@/components/ui/button";
import Link from "next/link";

const Warning = ({ heading, description }) => {
  return (
    <div className="flex p-4 items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        <p className="text-3xl font-bold mb-4">Warning</p>
        <p className="font-medium">{heading}</p>
        <p className="text-sm">{description}</p>
        <Link className="mt-4" href="/contact">
          <Button>Contact Somana</Button>
        </Link>
      </div>
    </div>
  );
};
export default Warning;
