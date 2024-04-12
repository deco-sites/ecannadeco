/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "../../components/ui/PageWrap.tsx";
import OrderStatus from "../../components/ui/OrderStatus.tsx";
import { SavedCreditCard } from "../../components/ui/CheckoutUpsellModal.tsx";
import CheckoutUpsellModal from "../../islands/CheckoutUpsellModal.tsx";
import { format } from "datetime";

import type {
  Order,
  PaginationOrderResponse,
} from "../../actions/getUserOrders.ts";
import Slider from "../../components/ui/Slider.tsx";
import { useUI } from "../../sdk/useUI.ts";
import SliderJS from "../../islands/SliderJS.tsx";

function MyOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    setIsLoading(true);

    try {
      invoke["deco-sites/ecannadeco"].actions.getUserOrders({
        token: localStorage.getItem("AccessToken") || "",
      }).then((r) => {
        const res = r as PaginationOrderResponse;

        setOrders(res.docs);

        console.log({ res });

        setIsLoading(false);
      });
    } catch (e) {
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
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-center">
              <h3 class="text-2xl text-[#8b8b8b] font-semibold text-center">
                Meus Pedidos
              </h3>
            </div>
            <div>
              <ul class="flex flex-col gap-2">
                {orders && orders.map((o) => {
                  return (
                    <li class="p-3 bg-[#cacaca] flex justify-between items-center rounded-md text-[10px] sm:text-xs md:text-sm">
                      <span>{o.items[0].sku.name}</span>
                      <span>{"RS " + ((o.value / 100).toFixed(2))}</span>
                      <span>
                        {format(new Date(o.created_at), "dd/MM/yyyy")}
                      </span>
                      <OrderStatus status={o.status} />
                    </li>
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
