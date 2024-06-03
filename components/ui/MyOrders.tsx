/**
 * This component was made to control if user is logged in to access pages
 */
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "../../components/ui/PageWrap.tsx";
import OrderStatus from "../../components/ui/OrderStatus.tsx";
import { format } from "datetime";
import type {
  Order,
  PaginationOrderResponse,
} from "../../actions/getUserOrders.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

const OrderItem = (
  { name, value, created_at, status }: {
    name: string;
    value: string;
    created_at: string;
    status:
      | "PAID"
      | "PENDING"
      | "CANCELED"
      | "IN_PRODUCTION"
      | "PENDING_SHIPPING"
      | "SHIPPED"
      | "DELIVERED";
  },
) => {
  return (
    <li class="p-3 bg-[#cacaca] flex justify-between items-center rounded-md text-[10px] sm:text-xs md:text-sm">
      <div class="w-[25%] flex justify-start">
        <span>{name}</span>
      </div>
      <div class="w-[25%] flex justify-start">
        <span>{"RS " + value}</span>
      </div>
      <div class="w-[25%] flex justify-center">
        <span>
          {created_at}
        </span>
      </div>
      <div class="w-[25%] flex justify-end">
        <OrderStatus status={status} />
      </div>
    </li>
  );
};

function MyOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    setIsLoading(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AccessToken") || "";
    }

    try {
      invoke["deco-sites/ecannadeco"].actions.getUserOrders({
        token: accessToken,
      }).then((r) => {
        const res = r as PaginationOrderResponse;

        setOrders(res.docs);

        console.log({ res });

        setIsLoading(false);
      });
    } catch (_e) {
      setIsLoading(false);
      alert(
        "Não foi possível recuperar Pedidos do usuário. Contacte o suporte.",
      );
    }
  }, []); // Passando um array de dependências vazio

  return (
    <PageWrap>
      {isLoading
        ? <span class="loading loading-spinner text-green-600"></span>
        : (
          <div class="flex flex-col gap-5 w-full">
            <div class="flex justify-center">
              <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
                Meus Pedidos
              </h3>
            </div>
            <div>
              <div class="flex pb-2 px-2 border-b border-[#cdcdcd] mb-4">
                <div class="w-[25%] flex justify-start">
                  <span class="text-xs">Produto</span>
                </div>
                <div class="w-[25%] flex justify-start">
                  <span class="text-xs">Valor</span>
                </div>
                <div class="w-[25%] flex justify-center">
                  <span class="text-xs">
                    Data
                  </span>
                </div>
                <div class="w-[25%] flex justify-end">
                  <span class="text-xs">Status</span>
                </div>
              </div>
              <ul class="flex flex-col gap-2">
                {orders && orders.map((o) => {
                  return (
                    <OrderItem
                      name={o.items[0].sku.name}
                      value={(o.value / 100).toFixed(2)}
                      created_at={format(new Date(o.created_at), "dd/MM/yyyy")}
                      status={o.status}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        )}
    </PageWrap>
  );
}

export default MyOrders;
