"use client"


import { useDispatch, useSelector } from "react-redux";
import { setDeliveries, setSelectedDelivery, setClients, setJiraLabels, setDeliveryModel } from "@/redux/features/deliverySlice";
import { getDeliveries, getClients, getJiraLabels } from "@/services/deliveryService"


import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { Suspense, useEffect, useMemo, useState } from "react";
import AssemblyTable from "./AssemblyTable";
import DeliveryInput from "./DeliveryInput";

import { orderBy } from "lodash";


const DeliveryTable = () => {

    const tableHeaders = {
        delivery: "Delivery",
        jiraLabel: "Jira Label",
        client: "Client"
    }

    const searchByOptions = {
        delivery: tableHeaders.delivery,
        jiraLabel: tableHeaders.jiraLabel,
        client: tableHeaders.client
    }

    const sortByOptions = {
        delivery: tableHeaders.delivery,
        jiraLabel: tableHeaders.jiraLabel,
        client: tableHeaders.client
    }

    const [deliveryQuery, setDeliveryQuery] = useState("");
    const [jiraLabelQuery, setJiraLabelQuery] = useState("");
    const [clientQuery, setClientQuery] = useState("");
    const [searchBy, setSearchBy] = useState(searchByOptions.delivery);

    const [sortedBy, setSortedBy] = useState({
        isSorted: true,
        sortBy: sortByOptions.delivery
    });



    const { selectedDelivery, currentDelivery, deliveryModels } = useSelector((state) => state.delivery);
    const dispatch = useDispatch();


    const geteData = async () => {
        const deliveriesData = getDeliveries();
        const clientsData = getClients();
        const jiraLabelsData = getJiraLabels();

        const [deliveries, clients, jiraLabels] = await Promise.all([deliveriesData, clientsData, jiraLabelsData]);


        dispatch(setDeliveries(deliveries));
        dispatch(setClients(clients));
        dispatch(setJiraLabels(jiraLabels));

        const deliveryModels = [];

        deliveries.forEach(delivery => {
            let newObj = { ...delivery };
            const jiraLabelDescription = jiraLabels.find(label => label.id == delivery.deliveryLabel).jiraLabel;
            newObj.jiraLabelDescription = jiraLabelDescription;

            const clientDescription = clients.find(client => client.id == delivery.clientId).clientDescription;
            newObj.clientDescription = clientDescription;

            deliveryModels.push(newObj);
        })

        dispatch(setDeliveryModel(deliveryModels));

    }
    useEffect(() => {
        geteData()

    }, [])

    //---------------------------------Handle Query by deliveries--------------------//
    const handleDeliveryQuery = (e) => {
        setSearchBy(searchByOptions.delivery);
        const query = e.target.value;
        setDeliveryQuery(query);
    }
    //---------------------------------Handle Query by deliveries--------------------//
    const handleJiraLeblQuery = (e) => {
        setSearchBy(searchByOptions.jiraLabel);
        const query = e.target.value;
        setJiraLabelQuery(query);
    }
    //---------------------------------Handle Query by deliveries--------------------//
    const handleClientQuery = (e) => {
        setSearchBy(searchByOptions.client);
        const query = e.target.value;
        setClientQuery(query);
    }

    const searchedData = useMemo(() => {


        //-----------------------------------Search by Delivery--------------------//
        if (searchBy == searchByOptions.delivery) {

            if (deliveryQuery == "") return deliveryModels;
            const filteredDeliveries = deliveryModels.filter(deliveryModel => deliveryModel.deliveryDescription.toLowerCase().includes(deliveryQuery.toLowerCase()))
            return filteredDeliveries;
        }

        //-------------------------------------Search by Jira Label--------------------//
        else if (searchBy == searchByOptions.jiraLabel) {
            if (jiraLabelQuery == "") return deliveryModels;
            const filteredDeliveries = deliveryModels.filter(deliveryModel => deliveryModel.jiraLabelDescription.toLowerCase().includes(jiraLabelQuery.toLowerCase()))
            return filteredDeliveries;

        }

        //-------------------------------------Search by CLient--------------------//
        else if (searchBy == searchByOptions.client) {
            if (clientQuery == "") return deliveryModels;
            const filteredDeliveries = deliveryModels.filter(deliveryModel => deliveryModel.clientDescription.toLowerCase().includes(clientQuery.toLowerCase()))
            return filteredDeliveries;

        }


    }, [deliveryQuery, jiraLabelQuery, clientQuery, deliveryModels])

    const sortedData = useMemo(() => {
        //--------------------sort by delivery---------------------//

        if (sortedBy.isSorted && sortedBy.sortBy == sortByOptions.delivery)
            return orderBy(searchedData, ["deliveryDescription"], "asc");
        else if (!sortedBy.isSorted && sortedBy.sortBy == sortByOptions.delivery)
            return orderBy(searchedData, ["deliveryDescription"], "desc");


        //--------------------sort by jiraLbael---------------------//
        if (sortedBy.isSorted && sortedBy.sortBy == sortByOptions.jiraLabel)
            return orderBy(searchedData, ["jiraLabelDescription"], "asc");
        else if (!sortedBy.isSorted && sortedBy.sortBy == sortByOptions.jiraLabel)
            return orderBy(searchedData, ["jiraLabelDescription"], "desc");

        //--------------------sort by client---------------------//
        if (sortedBy.isSorted && sortedBy.sortBy == sortByOptions.client)
            return orderBy(searchedData, ["clientDescription"], "asc");
        else if (!sortedBy.isSorted && sortedBy.sortBy == sortByOptions.client)
            return orderBy(searchedData, ["clientDescription"], "desc");
    }, [sortedBy, searchedData])


    const handleSort = (header) => {
        const sortOptions = { ...sortedBy };
        sortOptions.sortBy = header;
        sortOptions.isSorted = !sortedBy.isSorted;
        setSortedBy(sortOptions);
    }



    const renderSelectedRowClass = (deliveryId) => {
        const className = deliveryId == selectedDelivery?.deliveryId ? "w-full flex cursor-pointer bg-green-100 mb-2" : "w-full flex cursor-pointer hover:bg-green-100 mb-2";
        return className;
    }

    const handleSelectDelivery = (delivery) => {
        dispatch(setSelectedDelivery(delivery));
    }

    const renderSortIcon = (sortByLabel) => {
        if (sortedBy.sortBy == sortByLabel) {
            return sortedBy.isSorted ? < FaChevronDown /> : <FaChevronUp />;
        } else
            return null;
    }

    return (
        <div className="px-6">
            <DeliveryInput />
            <table className="w-full px-4 py-2 mt-5">
                <thead className="uppercase font-medium text-gray-400 text-sm border-b border-b-gray-200 p-6">
                    <tr className="w-full flex">
                        <td className="w-full flex justify-center items-center gap-2 text-black">
                            <input type="search" value={deliveryQuery} onChange={(e) => handleDeliveryQuery(e)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring ring-primary-500/20" placeholder={"Search Delivery..."} />
                        </td>
                        <td className="w-full flex justify-center items-center gap-2 text-black">
                            <input type="search" value={jiraLabelQuery} onChange={(e) => handleJiraLeblQuery(e)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring ring-primary-500/20" placeholder={"Search Jira Label..."} />
                        </td>
                        <td className="w-full flex justify-center items-center gap-2 text-black">
                            <input type="search" value={clientQuery} onChange={(e) => handleClientQuery(e)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring ring-primary-500/20" placeholder={"Search Client..."} />
                        </td>
                    </tr>

                    <tr className="w-full flex">
                        <td className="w-full">
                            <button onClick={() => handleSort(tableHeaders.delivery)} className="cursor-pointer w-full text-center flex justify-center items-center gap-2 px-4 py-2">
                                {tableHeaders.delivery}
                                <span> {renderSortIcon(tableHeaders.delivery)} </span>
                            </button>
                        </td>

                        <td className="w-full">
                            <button onClick={() => handleSort(tableHeaders.jiraLabel)} className="cursor-pointer w-full text-center flex justify-center items-center gap-2 px-4 py-2">
                                {tableHeaders.jiraLabel}
                                <span> {renderSortIcon(tableHeaders.jiraLabel)} </span>
                            </button>
                        </td>

                        <td className="w-full">
                            <button onClick={() => handleSort(tableHeaders.client)} className="cursor-pointer w-full text-center flex justify-center items-center gap-2 px-4 py-2">
                                {tableHeaders.client}
                                <span> {renderSortIcon(tableHeaders.client)} </span>
                            </button>
                        </td>
                    </tr>
                </thead>
                <tbody >
                    {sortedData.map(delivery =>
                        <tr key={delivery.deliveryId} className={renderSelectedRowClass(delivery.deliveryId)} onClick={() => handleSelectDelivery(delivery)}>
                            <td className="w-full flex justify-center items-center gap-2 text-gray-500">{delivery.deliveryDescription}</td>
                            <td className="w-full flex justify-center items-center gap-2 text-gray-500">{delivery.jiraLabelDescription}</td>
                            <td className="w-full flex justify-center items-center gap-2 text-gray-500">{delivery.clientDescription}</td>
                        </tr>)}
                </tbody>
            </table>


            {currentDelivery &&
                <div className="bg-green-100 px-4 py-2 max-w-2xl mx-auto rounded-md font-medium mt-7 text-center">
                    Selected delivery :
                    <span>
                        {` ${currentDelivery.deliveryDescription} of ${currentDelivery.jiraLabelDescription} to client ${currentDelivery.clientDescription}`}
                    </span>
                </div>
            }
            {currentDelivery &&
                <Suspense fallback={<p className='text-center italic text-gray-400'>Loading...</p>}>
                    <AssemblyTable />
                </Suspense>}
        </div>
    )
}

export default DeliveryTable;