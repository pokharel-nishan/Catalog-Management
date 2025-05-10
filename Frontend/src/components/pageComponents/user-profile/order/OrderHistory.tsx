import { useState } from "react";
import { Link } from "react-router-dom";
import type { Order } from "./OrderSummary";
import { sampleOrders } from "../../../../data/order";
import AccLayout from "../UserSidebar";

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState<
    "All" | "On its way" | "Delivered" | "Cancelled" | "Payment Settled"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Order | "not_found" | null>(null);

  const orders: Order[] = sampleOrders;

  const handleSearch = () => {
    const result = orders.find((order) => order?.code === searchQuery);
    setSearchResult(result || "not_found");
  };

  const filterOrders = () => {
    if (activeTab === "All") return orders;

    return orders.filter((order) => {
      if (activeTab === "On its way") return order?.state === "Shipped";
      if (activeTab === "Delivered") return order?.state === "Delivered";
      if (activeTab === "Cancelled") return order?.state === "Cancelled";
      if (activeTab === "Payment Settled") return order?.state === "PaymentSettled";
      return false;
    });
  };

  const noOrdersData = {
    All: {
      image: "/images/noordersplaced.png",
      message: "You have not placed any orders yet.",
    },
    "On its way": {
      image: "/images/noordersplaced.png",
      message: "There are currently no orders on the way.",
    },
    Delivered: {
      image: "/images/noordersplaced.png",
      message: "No orders have been delivered yet.",
    },
    Cancelled: {
      image: "/images/noordersplaced.png",
      message: "There are no cancelled orders.",
    },
    "Payment Settled": {
      image: "/images/noordersplaced.png",
      message: "You have no settled payment orders.",
    },
  };

  const renderOrders = (ordersToRender: Order[]) => {
    if (!ordersToRender || ordersToRender.length === 0) {
      return (
        <div className="flex flex-col items-center mt-20">
          <img
            src={noOrdersData[activeTab].image}
            alt={`No orders in ${activeTab} tab`}
            className="w-32 h-32 lg:w-56 lg:h-56 object-contain"
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

    return ordersToRender
      .filter((order) => {
        if (activeTab === "All") return true;
        if (activeTab === "On its way") return order?.state === "Shipped";
        if (activeTab === "Payment Settled")
          return order?.state === "PaymentSettled";
        return order?.state === activeTab;
      })
      .map((order) => (
        <div
          key={order.id}
          className="p-4 mt-4 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b pb-4">
            <div>
              <h3
                className={`font-bold text-sm lg:text-base ${
                  order?.state === "Delivered"
                    ? "text-green-600"
                    : order?.state === "Cancelled"
                    ? "text-red-600"
                    : order?.state === "PaymentSettled"
                    ? "text-yellow-600"
                    : "text-blue-600"
                }`}
              >
                {order?.state} ·{" "}
                <span className="text-black">Order ID #{order?.code}</span>
              </h3>
              <div className="flex flex-col lg:flex-row lg:space-x-8 text-xs lg:text-sm text-gray-500 mt-2">
                <p>
                  Placed on:{" "}
                  {new Date(order.payments[0].updatedAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                {order?.state === "Shipped" &&
                  order?.fulfillments?.[0]?.updatedAt && (
                    <p>
                      Shipped on:{" "}
                      {new Date(
                        order.fulfillments[0].updatedAt
                      ).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}

                {order?.state === "Delivered" &&
                  order?.fulfillments?.[0]?.updatedAt && (
                    <p>
                      Delivered on:{" "}
                      {new Date(
                        order.fulfillments[0].updatedAt
                      ).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                {order?.state === "Cancelled" &&
                  order?.payments?.[0]?.updatedAt && (
                    <p>
                      Cancelled on:{" "}
                      {new Date(
                        order.payments[0].updatedAt
                      ).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                {order?.state === "PaymentSettled" &&
                  order?.payments?.[0]?.updatedAt && (
                    <p>
                      Payment Settled on:{" "}
                      {new Date(
                        order.payments[0].updatedAt
                      ).toLocaleDateString("en-US", {
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
            {order.lines.map((item, index) => (
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
      <AccLayout>
        <section className="">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex flex-wrap space-x-2 lg:space-x-4 mb-4 lg:mb-0">
              {["All", "Payment Settled", "On its way", "Delivered", "Cancelled"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`${
                      activeTab === tab
                        ? "border border-orange-600 text-orange-600"
                        : "text-primary"
                    } font-medium py-2 px-4 rounded-md text-sm lg:text-base hover:bg-orange-600 hover:text-white`}
                    onClick={() => {
                      setActiveTab(
                        tab as
                          | "All"
                          | "On its way"
                          | "Delivered"
                          | "Cancelled"
                          | "Payment Settled"
                      );
                      setSearchResult(null);
                    }}
                  >
                    {tab}
                  </button>
                )
              )}
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
                className="py-2 px-4 bg-secondary text-white font-medium rounded-md text-sm lg:text-base"
                onClick={handleSearch}
              >
                Track
              </button>
            </div>
          </div>

          {searchResult === "not_found" ? (
            <div className="flex flex-col items-center mt-20">
              <img
                src="/images/noresults.png"
                alt="No order found"
                className="w-32 h-32 lg:w-56 lg:h-56 object-contain"
              />
              <h2 className="text-lg lg:text-xl font-semibold mt-6 text-red-600">
                #{searchQuery}
              </h2>
              <p className="text-gray-500 mt-2 text-sm lg:text-base">
                No result found for this order id.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex justify-center py-2 px-4 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors text-sm lg:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          ) : searchResult ? (
            renderOrders([searchResult as Order])
          ) : (
            renderOrders(filterOrders())
          )}
        </section>
      </AccLayout>
    </main>
  );
};

export default MyOrders;