import { useState } from "react";
import { Link } from "react-router-dom";
import { sampleOrders } from "../../../../data/order";
import type { OrderType } from "../../../../types/order";

const TABS = ["All", "Processed Order", "Delivered", "Cancelled"] as const;
type TabType = typeof TABS[number];

const STATE_MAP: Record<TabType, string | null> = {
  All: null,
  "Processed Order": "Processed",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

const noOrdersData = {
  All: {
    image: "/noorders.png",
    message: "You have not placed any orders yet.",
  },
  "Processed Order": {
    image: "/noorders.png",
    message: "There are currently no orders on the way.",
  },
  Delivered: {
    image: "/noorder.png",
    message: "No orders have been delivered yet.",
  },
  Cancelled: {
    image: "/noorders.png",
    message: "There are no cancelled orders.",
  },
};

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<OrderType | "not_found" | null>(null);

  const handleSearch = () => {
    const result = sampleOrders.find((order) => order.code === searchQuery.trim());
    setSearchResult(result || "not_found");
  };

  const filteredOrders = (): OrderType[] => {
    const stateFilter = STATE_MAP[activeTab];
    if (!stateFilter) return sampleOrders;
    return sampleOrders.filter((order) => order.state === stateFilter);
  };

  const renderOrders = (orders: OrderType[]) => {
    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center mt-20">
          <img
            src={noOrdersData[activeTab].image}
            alt={`No orders in ${activeTab} tab`}
            className="w-52 h-52 lg:w-96 lg:h-96 object-contain"
          />
          <h2 className="text-gray-500 mt-2 text-sm lg:text-base">
            {noOrdersData[activeTab].message}
          </h2>
          <Link
            to="/"
            className="mt-6 inline-flex justify-center py-2 px-4 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors text-sm lg:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      );
    }

    return orders.map((order) => (
      <div
        key={order.id}
        className="p-4 mt-4 bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b pb-4">
          <div>
            <h3
              className={`font-bold text-sm lg:text-base ${
                order.state === "Delivered"
                  ? "text-green-600"
                  : order.state === "Cancelled"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {order.state} ·{" "}
              <span className="text-black">Order ID #{order.code}</span>
            </h3>
            <div className="flex flex-col lg:flex-row lg:space-x-8 text-xs lg:text-sm text-gray-500 mt-2">
              {order.payments?.[0]?.updatedAt && (
                <p>
                  Placed on:{" "}
                  {new Date(order.payments[0].updatedAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}

              {order.fulfillments?.[0]?.updatedAt &&
                (order.state === "Processed" || order.state === "Delivered") && (
                  <p>
                    {order.state} on:{" "}
                    {new Date(order.fulfillments[0].updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}

              {["Cancelled"].includes(order.state || "") &&
                order.payments?.[0]?.updatedAt && (
                  <p>
                    {order.state} on:{" "}
                    {new Date(order.payments[0].updatedAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
            </div>
          </div>
          <div className="text-blue-600 font-bold text-lg lg:text-xl mt-2 lg:mt-0">
            Rs. {order.totalWithTax}
          </div>
        </div>
        <div className="mt-4">
          {order.lines?.map((item, index) => (
            <div key={index} className="flex flex-row justify-between py-2">
              <div className="flex items-center space-x-4">
                <img
                  src={item.featuredAsset?.preview || "/images/default-book.jpg"}
                  alt={item.productVariant.name}
                  className="w-12 h-12 lg:w-16 lg:h-16 object-cover"
                />
                <span className="text-primary text-sm lg:text-base">
                  {item.productVariant.name}
                </span>
              </div>
              <div className="flex flex-row space-x-4 lg:space-x-8 text-xs lg:text-sm mt-2 lg:mt-0">
                <span>X{item.quantity}</span>
                <span>Rs. {item.unitPriceWithTax}</span>
                <span>Rs. {item.linePriceWithTax}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <main className="bg-gray-50 min-h-screen">
        <section>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex flex-wrap space-x-2 lg:space-x-4 mb-4 lg:mb-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`${
                    activeTab === tab
                      ? "border border-orange-600 text-orange-600"
                      : "text-primary"
                  } font-medium py-2 px-4 rounded-md text-sm lg:text-base hover:bg-orange-600 hover:text-white`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchResult(null);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 ">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tracking order id"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base focus:outline-none focus:ring-primary focus:border-primary w-full lg:w-auto"
              />
              <button
                className="py-2 px-4 bg-primary text-white font-medium rounded-md text-sm lg:text-base"
                onClick={handleSearch}
              >
                Track
              </button>
            </div>
          </div>

          {searchResult === "not_found" ? (
            <div className="flex flex-col items-center mt-20">
              <img
                src="/noresults.png"
                alt="No order found"
                className="w-32 h-32 lg:w-96 lg:h-96 object-cover"
              />
              <h2 className="text-lg lg:text-xl font-semibold mt-6 text-red-600">
                #{searchQuery}
              </h2>
              <p className="text-gray-500 mt-2 text-sm lg:text-base">
                No result found for this order id.
              </p>
              <Link
                to="/books"
                className="mt-6 inline-flex justify-center py-2 px-4 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors text-sm lg:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          ) : searchResult ? (
            renderOrders([searchResult])
          ) : (
            renderOrders(filteredOrders())
          )}
        </section>
    </main>
  );
};

export default MyOrders;
