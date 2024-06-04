import { useQuery, getPaginatedProducers } from 'wasp/client/operations';
import { useState, useEffect } from 'react';
import Loader from '../common/Loader';
import DropdownEditDelete from './DropdownEditDelete';
import { ProducerTheme } from 'wasp/ext-src/shared/types';


const ProducersTable = () => {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [shopName, setShopName] = useState<string | undefined>(undefined);
  const [themeFilter, setThemeFilter] = useState<ProducerTheme | undefined>(undefined);

  const { data, isLoading, error } = useQuery(getPaginatedProducers, {
    skip,
    shopnameContains: shopName,
    themeFilter: themeFilter,
  });

  useEffect(() => {
    setPage(1);
  }, [shopName, themeFilter]);

  useEffect(() => {
    setSkip((page - 1) * 10);
  }, [page]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
        <div className='flex-col flex items-start justify-between p-6 gap-3 w-full bg-gray-100/40 dark:bg-gray-700/50'>
          <span className='text-sm font-medium'>Filters:</span>
          <div className='flex items-center justify-between gap-3 w-full px-2'>
            <div className='relative flex items-center gap-3 '>
              <label htmlFor='shopName-filter' className='block text-sm text-gray-700 dark:text-white'>
                Shop Name:
              </label>
              <input
                type='text'
                id='shopName-filter'
                placeholder='Shop Name'
                onChange={(e) => {
                  setShopName(e.currentTarget.value);
                }}
                className='rounded border border-stroke py-2 px-5 bg-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
              <label htmlFor='theme-filter' className='block text-sm ml-2 text-gray-700 dark:text-white'>
                Theme:
              </label>
              <select
                name='theme-filter'
                onChange={(e) => {
                  setThemeFilter(e.target.value as ProducerTheme);
                }}
                className='relative z-20 w-full appearance-none rounded border border-stroke bg-white p-2 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
              >
                <option value=''>Select Theme</option>
                <option value='ELEVEUR'>ELEVEUR</option>
                <option value='MARAICHER'>MARAICHER</option>
                <option value='MODE'>MODE</option>
                <option value='AUTRES'>AUTRES</option>
              </select>
            </div>
            {!isLoading && (
              <div className='max-w-60'>
                <span className='text-md mr-2 text-black dark:text-white'>Page</span>
                <input
                  type='number'
                  value={page}
                  min={1}
                  max={data?.totalPages}
                  onChange={(e) => {
                    setPage(parseInt(e.currentTarget.value));
                  }}
                  className='rounded-md border-1 border-stroke bg-transparent px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
                <span className='text-md text-black dark:text-white'> / {data?.totalPages} </span>
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-12 border-t-4 border-stroke py-4.5 px-4 dark:border-strokedark md:px-6'>
          <div className='col-span-3 flex items-center'>
            <p className='font-medium'>First Name</p>
          </div>
          <div className='col-span-3 flex items-center'>
            <p className='font-medium'>Surname</p>
          </div>
          <div className='col-span-3 flex items-center'>
            <p className='font-medium'>Shop Name</p>
          </div>
          <div className='col-span-3 flex items-center'>
            <p className='font-medium'>Theme</p>
          </div>
        </div>
        {isLoading && (
          <div className='-mt-40'>
            <Loader />
          </div>
        )}
        {!!data?.producers &&
          data?.producers?.length > 0 &&
          data.producers.map((producer) => (
            <div
              key={producer.id}
              className='grid grid-cols-12 gap-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6'
            >
              <div className='col-span-3 flex items-center'>
                <p className='text-sm text-black dark:text-white'>{producer.firstname}</p>
              </div>
              <div className='col-span-3 flex items-center'>
                <p className='text-sm text-black dark:text-white'>{producer.surname}</p>
              </div>
              <div className='col-span-3 flex items-center'>
                <p className='text-sm text-black dark:text-white'>{producer.shopname}</p>
              </div>
              <div className='col-span-3 flex items-center'>
                <p className='text-sm text-black dark:text-white'>{producer.theme}</p>
              </div>
              {/* <div className='col-span-1 flex items-center'>
                <DropdownEditDelete />
              </div> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProducersTable;
