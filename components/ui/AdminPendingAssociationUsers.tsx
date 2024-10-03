/**
 * This component was made to control if user is logged in to access pages
 */
// import type { SectionProps } from "deco/types.ts";
// import { useUI } from "../../sdk/useUI.ts";
import { useEffect, useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import PageWrap from "./PageWrap.tsx";
import Icon from "deco-sites/ecannadeco/components/ui/Icon.tsx";
import { format } from "datetime";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { AssociationUsers } from "../../actions/adminGetAssociationUsers.ts";

function AdminPendingAssociationUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const [_limit, setLimit] = useState<number>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [associationUsers, setAssociationUsers] = useState<AssociationUsers>();
  const [isApproving, setIsApproving] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const handleApproveUser = async (id: string) => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }
    setIsApproving(true);

    try {
      await invoke["deco-sites/ecannadeco"].actions.adminApproveAssociationUser(
        {
          token: accessToken,
          id,
        },
      );
      setIsApproving(false);

      const users = associationUsers;
      const userIndex = users?.findIndex((user) => user._id === id);

      if (userIndex) {
        users![userIndex].associationApproved = true;
      }

      setAssociationUsers(users);

      // handleGetUsers(1);
    } catch (_e) {
      alert(
        "Não foi possível aprovar paciente. Tente novamente mais tarde ou contecte o suporte.",
      );
    }
  };

  const handleGetUsers = (pageParam: number, _email?: string) => {
    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }
    setIsLoadingUsers(true);

    try {
      invoke["deco-sites/ecannadeco"].actions
        .adminGetPendingAssociationUsers({
          token: accessToken,
          params: {
            page: pageParam,
            limit: 100,
          },
        })
        .then((r) => {
          if (r.message) {
            throw new Error(r.message);
          }
          setPage(r.page);
          setTotalPages(r.totalPages);
          setLimit(r.limit);
          setHasNextPage(r.hasNextPage);
          setHasPrevPage(r.hasPrevPage);
          setAssociationUsers(r.docs);
          setIsLoading(false);
        });
    } catch (_e) {
      alert(
        "Não foi possível carregar usuários. Tente novamente mais tarde ou contecte o suporte.",
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);

    let accessToken = "";

    if (IS_BROWSER) {
      accessToken = localStorage.getItem("AdminAccessToken") || "";
    }

    try {
      invoke["deco-sites/ecannadeco"].actions
        .adminGetPendingAssociationUsers({
          token: accessToken,
          params: {
            page: 1,
            limit: 100,
          },
        })
        .then((r) => {
          console.log({ getUsersResponse: r });
          if (r.message) {
            throw new Error(r.message);
          }
          setPage(r.page);
          setTotalPages(r.totalPages);
          setLimit(r.limit);
          setHasNextPage(r.hasNextPage);
          setHasPrevPage(r.hasPrevPage);
          setAssociationUsers(r.docs);
          setIsLoading(false);
        });
    } catch (_e) {
      setIsLoading(false);
      alert("Não foi possível recuperar Pedidos..");
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
                Usuários De Associação Pendentes de Aprovação
              </h3>
            </div>
            <div class="my-5 flex gap-8">
              {
                /* <select
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
              </select> */
              }
            </div>
            <div>
              <div class="flex pb-2 px-2 border-b border-[#cdcdcd] mb-4">
                <div class="w-[30%] flex justify-start">
                  <span class="text-xs">Nome</span>
                </div>
                <div class="w-[30%] flex justify-start">
                  <span class="text-xs">Associação</span>
                </div>
                <div class="w-[30%] flex justify-end">
                  <span class="text-xs">Data Cadastro</span>
                </div>
                <div class="w-[10%] flex justify-end">
                  <span class="text-xs">Aprovado</span>
                </div>
              </div>
              <ul class="flex flex-col gap-2">
                {isLoadingUsers
                  ? <span class="loading loading-spinner text-green-600"></span>
                  : (
                    <ul class="flex flex-col gap-2">
                      {associationUsers &&
                        associationUsers.map((u) => {
                          return (
                            <div class="dropdown dropdown-top dropdown-end">
                              <div tabindex={0} role="button" class="">
                                <div target="_blank">
                                  <li class="p-3 bg-[#cacaca] flex gap-[2%] justify-between items-center rounded-md text-[10px] sm:text-xs md:text-sm">
                                    <div class="w-[30%] flex justify-start">
                                      <span>
                                        {u.cognito_data
                                          ? (
                                            u.cognito_data.name
                                          )
                                          : (
                                            <span class="badge text-xs font-bold">
                                              Cadastro Pendente
                                            </span>
                                          )}
                                      </span>
                                    </div>
                                    <div class="w-[30%] flex justify-start">
                                      <span>
                                        {u.association
                                          ? u.association.name
                                          : "n/a"}
                                      </span>
                                    </div>
                                    <div class="w-[30%] flex justify-end">
                                      <span>
                                        {format(
                                          new Date(
                                            u.created_at ? u.created_at : "",
                                          ),
                                          "dd/MM/yyyy",
                                        )}
                                      </span>
                                    </div>
                                    <div class="w-[10%] flex justify-end">
                                      <span>
                                        {u.associationApproved
                                          ? (
                                            <span class="badge badge-xs text-xs bg-green-700 text-white border-none p-2">
                                              Aprovado
                                            </span>
                                          )
                                          : (
                                            <span class="badge badge-xs text-xs bg-orange-600 text-white border-none p-2">
                                              Pendente
                                            </span>
                                          )}
                                      </span>
                                    </div>
                                  </li>
                                </div>
                              </div>
                              <ul
                                tabindex={0}
                                class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                              >
                                <span class="text-[10px] font-bold text-center">
                                  {u.email}
                                </span>
                                <li>
                                  <a
                                    href={`https://api.ecanna.com.br/ficha/${u._id}`}
                                    target="_blank"
                                    class="flex items-center"
                                  >
                                    <Icon id="Form" size={19} />
                                    Ficha do Paciente
                                  </a>
                                </li>
                                {!u.associationApproved && (
                                  <li>
                                    <a
                                      onClick={() => {
                                        handleApproveUser(u._id);
                                      }}
                                    >
                                      <Icon id="CircleCheck" size={19} />
                                      {isApproving
                                        ? "Aprovando..."
                                        : "Aprovar Paciente"}
                                    </a>
                                  </li>
                                )}
                              </ul>
                            </div>
                          );
                        })}
                    </ul>
                  )}
              </ul>
              {/* pagination */}
              <div class="flex justify-center mt-4">
                <div>
                  {hasPrevPage && (
                    <Icon
                      onClick={() => handleGetUsers(page! - 1)}
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
                      onClick={() => handleGetUsers(page! + 1)}
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

export default AdminPendingAssociationUsers;
