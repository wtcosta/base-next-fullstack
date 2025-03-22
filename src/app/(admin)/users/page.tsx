import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { userService } from "@/services/user";
import { ContainerUsersPage } from "./components/container";

export default async function UsersPage() {
  const users = await userService.findAll();

  return (
    <div>
      <PageBreadcrumb pageTitle="Usuários" />
      <ContainerUsersPage users={users}/>
    </div>
  );
}
