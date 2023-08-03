"use client"
import { useEffect, useMemo, useState } from "react";


import { useSelector, useDispatch } from "react-redux"
import { getAssemblies, getBranchAssembles, getVersions } from "@/services/deliveryService";
import { setAssemblies, setBranchVersions, setSelectedAssembly, resetAssemblyInput } from "@/redux/features/deliverySlice";

import { orderBy } from "lodash";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import AssemblyInput from "./AssemblyInput";

const AssemblyTable = () => {

    const tableHeaders = {
        artifact: "Artifact",
        currentBranch: "Current branch-version",
        targetVersion: "Target branch-version"
    }

    const searchByOptions = {
        artifact: tableHeaders.artifact,
        currentBranch: tableHeaders.currentBranch,
        targetVersion: tableHeaders.targetVersion
    }

    const sortByOptions = {
        artifact: tableHeaders.artifact,
        currentBranch: tableHeaders.currentBranch,
        targetVersion: tableHeaders.targetVersion
    }


    //--------------------------Local States-----------------//


    const [artifactQuery, setArtifactQuery] = useState("");
    const [currentBranchQuery, setCurrentBranchQuery] = useState("");
    const [targetVersionQuery, setTargetVersionQuery] = useState("");
    const [searchBy, setSearchBy] = useState(searchByOptions.artifact);

    const [sortedBy, setSortedBy] = useState({
        isSorted: true,
        sortBy: sortByOptions.artifact
    });

    //-------------------------Global States----------------------//

    const { currentDelivery, selectedAssembly } = useSelector((state) => state.delivery);
    const dispatch = useDispatch();

    const assemblyData = currentDelivery.deliveryAssemblies;

    const getAssembliesAndVersions = async () => {
        // const assembliesData = getAssemblies();
        // const versionData = getVersions();
        // const [assemblies, versions] = await Promise.all([assembliesData, versionData]);

        const branchAssembles = await getBranchAssembles();
        dispatch(setAssemblies(branchAssembles));
    }

    useEffect(() => {
        getAssembliesAndVersions();
        dispatch(setSelectedAssembly(null));
    }, [currentDelivery])


    //---------------------------------Handle Query by Artifacts--------------------//
    const handleArtifactQuery = (e) => {
        setSearchBy(searchByOptions.artifact);
        const query = e.target.value;
        setArtifactQuery(query);
    }

    //---------------------------------Handle Query by Current Version--------------------//
    const handleCurrentVersionQuery = (e) => {
        setSearchBy(searchByOptions.currentBranch);
        const query = e.target.value;
        setCurrentBranchQuery(query);
    }

    //---------------------------------Handle Query by Target Version--------------------//
    const handleTargetVersionQuery = (e) => {
        setSearchBy(searchByOptions.targetVersion);
        const query = e.target.value;
        setTargetVersionQuery(query);
    }


    const searchedData = useMemo(() => {


        //-----------------------------------Search by Artifacts--------------------//
        if (searchBy == searchByOptions.artifact) {

            if (artifactQuery == "") return assemblyData;
            const filteredAssemblies = assemblyData.filter(artifact => artifact.assembly.toLowerCase().includes(artifactQuery.toLowerCase()))
            return filteredAssemblies;
        }

        //-------------------------------------Search by current branch-------------------//
        else if (searchBy == searchByOptions.currentBranch) {
            if (currentBranchQuery == "") return assemblyData;
            const filteredAssemblies = assemblyData.filter(artifact => artifact.sourceVersion.toLowerCase().includes(currentBranchQuery.toLowerCase()))
            return filteredAssemblies;

        }

        //-------------------------------------Search by target version--------------------//
        else if (searchBy == searchByOptions.targetVersion) {
            if (targetVersionQuery == "") return assemblyData;
            const filteredAssemblies = assemblyData.filter(artifact => artifact.targetVersion.toLowerCase().includes(targetVersionQuery.toLowerCase()))
            return filteredAssemblies;

        }


    }, [artifactQuery, currentBranchQuery, targetVersionQuery, assemblyData])


    const sortedData = useMemo(() => {

        //--------------------sort by assembly---------------------//

        if (sortedBy.isSorted && sortedBy.sortBy == sortByOptions.artifact)
            return orderBy(searchedData, ["assembly"], "asc");
        else if (!sortedBy.isSorted && sortedBy.sortBy == sortByOptions.artifact)
            return orderBy(searchedData, ["assembly"], "desc");


        //--------------------sort by sourceVersion---------------------//
        if (sortedBy.isSorted && sortedBy.sortBy == sortByOptions.currentBranch)
            return orderBy(searchedData, ["sourceVersion"], "asc");
        else if (!sortedBy.isSorted && sortedBy.sortBy == sortByOptions.currentBranch)
            return orderBy(searchedData, ["sourceVersion"], "desc");

        //--------------------sort by targetVersion---------------------//
        if (sortedBy.isSorted && sortedBy.sortBy == sortByOptions.targetVersion)
            return orderBy(searchedData, ["targetVersion"], "asc");
        else if (!sortedBy.isSorted && sortedBy.sortBy == sortByOptions.targetVersion)
            return orderBy(searchedData, ["targetVersion"], "desc");

    }, [sortedBy, searchedData])


    const handleSort = (header) => {
        const sortOptions = { ...sortedBy };
        sortOptions.sortBy = header;
        sortOptions.isSorted = !sortedBy.isSorted;
        setSortedBy(sortOptions);
    }

    const renderSortIcon = (sortByLabel) => {
        if (sortedBy.sortBy == sortByLabel) {
            return sortedBy.isSorted ? < FaChevronDown /> : <FaChevronUp />;
        } else
            return null;
    }
    const handleAssemblySelection = (assembly) => {
        dispatch(setSelectedAssembly(assembly));
        dispatch(resetAssemblyInput(false));
    }
    const renderSelectedRowClass = (assemblyId) => {
        const className = assemblyId == selectedAssembly?.deliveryAssemblyId ? "w-full flex cursor-pointer bg-green-100 mb-2" : "w-full flex cursor-pointer hover:bg-green-100 mb-2";
        return className;
    }



    return (
        <>
            <div className="px-6 mt-5">
                <AssemblyInput />
                <table className="w-full px-4 py-2 mt-5">
                    <thead className="uppercase font-medium text-gray-400 text-sm border-b border-b-gray-200 p-6">
                        <tr className="w-full flex">
                            <td className="w-full flex justify-center items-center gap-2 text-black" >
                                <input type="search" value={artifactQuery} onChange={(e) => handleArtifactQuery(e)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring ring-primary-500/20" placeholder={"Search Artifact..."} />
                            </td>
                            <td className="w-full flex justify-center items-center gap-2 text-black" >
                                <input type="search" value={currentBranchQuery} onChange={(e) => handleCurrentVersionQuery(e)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring ring-primary-500/20" placeholder={"Search Current Branch Version..."} />
                            </td>
                            <td className="w-full flex justify-center items-center gap-2 text-black" >
                                <input type="search" value={targetVersionQuery} onChange={(e) => handleTargetVersionQuery(e)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring ring-primary-500/20" placeholder={"Search Target Branch Version..."} />
                            </td>
                        </tr>

                        <tr className="w-full flex">
                            <td className="w-full">
                                <button onClick={() => handleSort(tableHeaders.artifact)}
                                    className="cursor-pointer w-full text-center flex justify-center items-center gap-2 px-4 py-2">
                                    {tableHeaders.artifact}
                                    <span> {renderSortIcon(tableHeaders.artifact)} </span>
                                </button>
                            </td>
                            <td className="w-full">
                                <button onClick={() => handleSort(tableHeaders.currentBranch)}
                                    className="cursor-pointer w-full text-center flex justify-center items-center gap-2 px-4 py-2">
                                    {tableHeaders.currentBranch}
                                    <span> {renderSortIcon(tableHeaders.currentBranch)} </span>
                                </button>
                            </td>

                            <td className="w-full">
                                <button onClick={() => handleSort(tableHeaders.targetVersion)}
                                    className="cursor-pointer w-full text-center flex justify-center items-center gap-2 px-4 py-2">
                                    {tableHeaders.targetVersion}
                                    <span> {renderSortIcon(tableHeaders.targetVersion)} </span>
                                </button>
                            </td>
                        </tr>
                    </thead>

                    <tbody >
                        {sortedData.map((assembly, index) =>
                            <tr key={index} className={renderSelectedRowClass(assembly.deliveryAssemblyId)} onClick={() => handleAssemblySelection(assembly)}>
                                <td className="w-full flex justify-center items-center gap-2 text-gray-500">{assembly.assembly}</td>
                                <td className="w-full flex justify-center items-center gap-2 text-gray-500">{assembly.sourceVersion}</td>
                                <td className="w-full flex justify-center items-center gap-2 text-gray-500">{assembly.targetVersion}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AssemblyTable