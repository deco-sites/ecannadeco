/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import OrderStatus from "./OrderStatus.tsx";
import OrderShippingTrackingCode from "./OrderShippingTrackingCode.tsx";
import Icon from "deco-sites/ecannadeco/components/ui/Icon.tsx";
import { format } from "datetime";
import { IS_BROWSER } from "$fresh/runtime.ts";

import type { Order } from "../../actions/getUserOrders.ts";

const OrderItem = ({
  productName,
  userEmail,
  name,
  productPrice,
  created_at,
  status,
  shipping_tracking_code,
  address,
  association,
  pdf_card,
  id,
}: {
  userEmail: string;
  name: string;
  productName: string;
  productPrice: string;
  created_at: string;
  id: string;
  address?: string;
  association?: string;
  shipping_tracking_code?: string;
  pdf_card?: string;
  status:
    | "PAID"
    | "PENDING"
    | "CANCELED"
    | "IN_PRODUCTION"
    | "PENDING_SHIPPING"
    | "SHIPPED"
    | "DELIVERED";
}) => {
  function downloadFile(fileUrl: string, filename: string) {
    // Fetch the file data
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary anchor element
        const a = document.createElement("a");
        a.style.display = "none";

        // Set the download attribute and file URL
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);

        // Append the anchor to the body and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  }

  return (
    <li class="p-3 bg-[#cacaca] flex justify-between items-center rounded-md text-[10px] sm:text-xs md:text-sm flex-wrap">
      <div class="w-[40%] flex flex-col justify-start truncate pr-4">
        <span class="font-bold">{name ? name : "sem nome"}</span>
        <span class="text-xs">{userEmail ? userEmail : "sem email"}</span>
      </div>
      <div class="w-[20%] flex flex-col justify-start">
        <span class="font-bold">{productName}</span>
        <span>{"RS " + productPrice}</span>
      </div>
      <div class="w-[20%] flex justify-center">
        <span>{created_at}</span>
      </div>
      <div class="w-[20%] flex justify-end">
        <OrderStatus status={status} id={id} adminView={true} />
      </div>
      <div class="mt-3">
        {address &&
          (productName === "CARTEIRINHA" ||
            productName === "CARTEIRINHA FREE") &&
          (
            <div class="w-full">
              <span class="text-xs">
                <span class="font-bold">Endereço:</span> {address}
              </span>
            </div>
          )}
        {association &&
          (productName === "CARTEIRINHA" ||
            productName === "CARTEIRINHA FREE") &&
          (
            <div class="w-full">
              <span class="text-xs">
                <span class="font-bold">Associação:</span> {association}
              </span>
            </div>
          )}
      </div>
      <div class="flex justify-between">
        {status === "SHIPPED" && (
          <div class="w-full">
            <OrderShippingTrackingCode
              code={shipping_tracking_code!}
              id={id}
              adminView={true}
            />
          </div>
        )}
        {pdf_card && (
          <div
            href={pdf_card}
            class="flex btn btn-ghost w-full"
            onClick={() =>
              downloadFile(pdf_card, `${name}-ecanna-carteirinha.pdf`)}
          >
            <Icon id="Download" size={19} />
          </div>
        )}
      </div>
    </li>
  );
};

function AdminOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>();
  const [limit, setLimit] = useState<number>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [statusSearch, setStatusSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    setIsLoading(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }

    try {
      invoke["deco-sites/ecannadeco"].actions
        .adminGetOrders({
          token: accessToken,
        })
        .then((r) => {
          setPage(r.page);
          setTotalPages(r.totalPages);
          setLimit(r.limit);
          setHasNextPage(r.hasNextPage);
          setHasPrevPage(r.hasPrevPage);
          setOrders(r.docs);

          console.log({ r });

          setIsLoading(false);
        });
    } catch (_e) {
      setIsLoading(false);
      alert("Não foi possível recuperar Pedidos..");
    }
  }, []); // Passando um array de dependências vazio

  const handleGetOrders = (pageParam: number, status?: string) => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }

    setIsLoading(true);

    try {
      invoke["deco-sites/ecannadeco"].actions
        .adminGetOrders({
          token: accessToken,
          params: {
            status: status,
            page: pageParam,
            type: typeFilter,
            limit: limit || 25,
          },
        })
        .then((r) => {
          const res = r as { message?: string; errors?: Array<unknown> };
          if (res.message) {
            throw new Error(res.message);
          }
          setPage(r.page);
          setTotalPages(r.totalPages);
          setLimit(r.limit);
          setHasNextPage(r.hasNextPage);
          setHasPrevPage(r.hasPrevPage);
          console.log({ docs: r.docs });
          setOrders(r.docs);
          setIsLoading(false);
        });
    } catch (_e) {
      alert(
        "Não foi possível carregar usuários. Tente novamente mais tarde ou contecte o suporte.",
      );
      setIsLoading(false);
    }
  };

  const handleToggleOnTimeFilter = () => {
    if (typeFilter === "") {
      setTypeFilter("ON_TIME");
      handleGetOrders(1, "");
    } else {
      setTypeFilter("");
      handleGetOrders(1, "");
    }
  };

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-5 w-full">
            <div class="flex justify-center">
              <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
                Pedidos Do Sistema
              </h3>
            </div>
            <div class="my-5 flex gap-8">
              <select
                value={statusSearch}
                onChange={(e) => {
                  setStatusSearch(e.currentTarget.value);
                  handleGetOrders(1, e.currentTarget.value);
                }}
                class="select select-primary h-[35px] rounded-full max-w-xs text-[#8b8b8b] border-none disabled:bg-[#e3e3e3] bg-white"
              >
                <option disabled selected>
                  Selecione o Status
                </option>
                <option value="">Todos</option>
                <option value="PAID">Pago</option>
                <option value="PENDING">Pendente</option>
                <option value="CANCELED">Cancelado</option>
                <option value="IN_PRODUCTION">Em Produção</option>
                <option value="PENDING_SHIPPING">Envio Pendente</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregue</option>
              </select>
              <div class="flex gap-1">
                <input
                  type="checkbox"
                  class="toggle"
                  checked={typeFilter === "ON_TIME"}
                  onChange={handleToggleOnTimeFilter}
                />
                <span>Pedidos de Carteirinha</span>
              </div>
            </div>
            <div>
              <div class="flex pb-2 px-2 border-b border-[#cdcdcd] mb-4">
                <div class="w-[40%] flex justify-start">
                  <span class="text-xs">Paciente</span>
                </div>
                <div class="w-[20%] flex justify-start">
                  <span class="text-xs">Produto</span>
                </div>
                <div class="w-[20%] flex justify-center">
                  <span class="text-xs">Data</span>
                </div>
                <div class="w-[20%] flex justify-end">
                  <span class="text-xs">Status</span>
                </div>
              </div>
              <ul class="flex flex-col gap-2">
                {orders &&
                  orders.map((o) => {
                    const adrss = o.user_data?.address &&
                      o.user_data.address[0];
                    console.log({ adrss });
                    return (
                      <OrderItem
                        userEmail={o.user_data?.email || ""}
                        name={o.user_data?.name || ""}
                        address={adrss
                          ? `${adrss.street} ${adrss.number}, ${adrss.complement} - ${adrss.neighborhood} - ${adrss.city}/${adrss.state}, ${adrss.cep}`
                          : undefined}
                        association={o.user_data?.association
                          ? o.user_data?.association.name
                          : undefined}
                        id={o._id}
                        productName={o.items[0].sku.name}
                        productPrice={(o.value / 100).toFixed(2)}
                        created_at={format(
                          new Date(o.created_at),
                          "dd/MM/yyyy",
                        )}
                        status={o.status}
                        shipping_tracking_code={o.shipping_tracking_code}
                        pdf_card={o.user_data?.pdf_card}
                      />
                    );
                  })}
              </ul>
              {/* pagination */}
              <div class="flex justify-center mt-4">
                <div>
                  {hasPrevPage && (
                    <Icon
                      onClick={() => handleGetOrders(page! - 1)}
                      id="ChevronLeft"
                      size={19}
                    />
                  )}
                </div>
                <div>
                  <span class="text-xs">{`Página ${page}/${totalPages}`}</span>
                </div>
                <div>
                  {hasNextPage && (
                    <Icon
                      onClick={() => handleGetOrders(page! + 1)}
                      id="ChevronRight"
                      size={19}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default AdminOrders;
