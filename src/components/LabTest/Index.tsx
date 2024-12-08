import { Link, usePath } from "raviger";

import Page from "@/components/Common/Page";
import { OrderPlaced } from "@/components/LabTest/OrderPlaced";
import { SpecimenCollected } from "@/components/LabTest/SpecimenCollected";

export const LabTest = () => {
  const currentPath = usePath();

  const tabButtonClasses = (selected: boolean) =>
    `min-w-max-content cursor-pointer whitespace-nowrap ${
      selected
        ? "border-primary-500 hover:border-secondary-300 text-primary-600 border-b-2"
        : "text-secondary-700 hover:text-secondary-700"
    } pb-2 border-b-2 text-sm`;

  const renderTabContent = () => {
    switch (currentPath) {
      case "/lab_tests/order_placed":
        return <OrderPlaced />;
      case "/lab_tests/specimen_collected":
        return <SpecimenCollected />;
      default:
        return <div className="text-center text-red-500">Tab not found</div>;
    }
  };

  return (
    <Page title="Lab Orders">
      <nav className="flex space-x-4 border-b border-gray-200 py-2">
        <Link
          href="/lab_tests/order_placed"
          className={tabButtonClasses(
            currentPath === "/lab_tests/order_placed",
          )}
        >
          Order Placed
        </Link>
        <Link
          href="/lab_tests/specimen_collected"
          className={tabButtonClasses(
            currentPath === "/lab_tests/specimen_collected",
          )}
        >
          Specimen Collected
        </Link>
        <Link
          href="/lab_tests/sent_to_lab"
          className={tabButtonClasses(currentPath === "/lab_tests/sent_to_lab")}
        >
          Sent to Lab
        </Link>
      </nav>

      <div className="mt-4">{renderTabContent()}</div>
    </Page>
  );
};
