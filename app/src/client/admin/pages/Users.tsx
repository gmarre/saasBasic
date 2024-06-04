import Breadcrumb from '../components/Breadcrumb';
import UsersTable from '../components/UsersTable';
import ProducersTable from '../components/ProducerTable';
import DefaultLayout from '../layout/DefaultLayout';

const Users = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />
      <div className="flex flex-col gap-10">
        <UsersTable />
      </div>
      <Breadcrumb pageName="Producers" />
      <div className="flex flex-col gap-10">
        <ProducersTable />
      </div>
    </DefaultLayout>
    
  );
};

export default Users;
