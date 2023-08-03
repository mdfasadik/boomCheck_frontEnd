"use client"
import { useEffect, useState } from "react";
import AssemblyDropdown from "../utils/AssemblyDropdown";


import { createDelivery, deleteDelivery, modifyAssembly } from "@/services/deliveryService";

import { useDispatch, useSelector } from "react-redux";
import {
    createNewDelivery,
    setCurrentDelivery,
    setDeliveries,
    selectedAssembly,
    updateDelivery,
    setSelectedAssembly,
    setBranchVersions,
    resetAssemblyInput
} from "@/redux/features/deliverySlice";

import DeleteModal from "../utils/DeleteModal";

const AssemblyInput = () => {

    const submissionTypes = {
        create: "create",
        update: "update",
    }

    //--------------------------------local states------------------------------//
    const [loading, setLoading] = useState(false);

    const [assemblyInput, setAssemblyInput] = useState("");
    const [sourceVersionInput, setSourceVersionInput] = useState("");
    const [targetVersionInput, setTargetVersionInput] = useState("");


    const [selectedAssemblyDescription, setSelectedAssemblyDescription] = useState("");
    const [selectedCurrentVersion, setSelectedCurrentVersion] = useState("");
    const [selectedTargetBranchVersion, setSelectedTargetBranchVersion] = useState("");

    const [submissionType, setSubmissionType] = useState(submissionTypes.create);
    const [showDeleteModal, setShowDeleteModal] = useState(false);



    //----------------------------------Global states from Redux-------------------------//
    const { currentDelivery, assemblies, branchVersions, selectedAssembly, resetAssemblyInputState } = useSelector((state) => state.delivery);
    const dispatch = useDispatch()

    const assemblyData = Object.keys(assemblies);


    useEffect(() => {

        if (selectedAssembly) {
            setSelectedAssemblyDescription(selectedAssembly.assembly);
            setSelectedCurrentVersion(selectedAssembly.sourceVersion);
            setSelectedTargetBranchVersion(selectedAssembly.targetVersion);

        } else {
            setSelectedAssemblyDescription("");
            setSelectedCurrentVersion("");
            setSelectedTargetBranchVersion("");
        }


    }, [selectedAssembly])

    useEffect(() => {

        setSelectedAssemblyDescription("");
        setSelectedCurrentVersion("");
        setSelectedTargetBranchVersion("");

    }, [currentDelivery])


    useEffect(() => {
        const branchVersionsData = assemblies[assemblyInput];
        dispatch(setBranchVersions(branchVersionsData));

    }, [assemblyInput])

    //-------------------------schema valiadtion for craete delivery------------------------------//

    const handleCreateDelivery = async (e) => {
        e.preventDefault();
        dispatch(resetAssemblyInput(false));
        const newAssembly = {};

        newAssembly.assembly = assemblyInput;
        newAssembly.sourceVersion = sourceVersionInput;
        newAssembly.targetVersion = targetVersionInput;


        let updateDeliveryModel = { ...currentDelivery };

        delete updateDeliveryModel.clientDescription;
        delete updateDeliveryModel.jiraLabelDescription;

        //=====================CONFUSION: Should I replace with the latest date (the date when updating)===============//
        updateDeliveryModel.deliveryDate = currentDelivery.deliveryDate;
        updateDeliveryModel.deliveryId = currentDelivery.deliveryId;
        updateDeliveryModel.deliveryAssemblies = [...currentDelivery.deliveryAssemblies];



        //------------------------Adding new assembly--------------------//
        if (submissionType == submissionTypes.create) {


            updateDeliveryModel.deliveryAssemblies.push(newAssembly);
            setLoading(true);
            const updatedDeliveryModel = await modifyAssembly(updateDeliveryModel, "add");
            const newCurrentDelivery = { ...currentDelivery };

            //----------------------add only the assemblies-------------------------------//
            newCurrentDelivery.deliveryAssemblies = updatedDeliveryModel.deliveryAssemblies;

            //----------------this two will be unchanged, so it is as same as previous current delivery---------------//
            newCurrentDelivery.clientDescription = currentDelivery.clientDescription;
            newCurrentDelivery.jiraLabelDescription = currentDelivery.jiraLabelDescription;

            setAssemblyInput("");
            dispatch(resetAssemblyInput(true));
            dispatch(setCurrentDelivery(newCurrentDelivery));
            dispatch(updateDelivery(newCurrentDelivery));
            setLoading(false);

        }
        //----------------------updating existing assembly-------------------//
        else if (submissionType == submissionTypes.update) {
            let foundIndex;
            let foundAssembly = {};

            updateDeliveryModel.deliveryAssemblies.forEach((existingAssembly, index) => {
                if (existingAssembly.deliveryAssemblyId == selectedAssembly.deliveryAssemblyId) {
                    foundIndex = index;
                    foundAssembly = { ...existingAssembly };

                    foundAssembly.assembly = assemblyInput == "" ? selectedAssemblyDescription : assemblyInput;
                    foundAssembly.sourceVersion = sourceVersionInput == "" ? selectedCurrentVersion : sourceVersionInput;
                    foundAssembly.targetVersion = targetVersionInput == "" ? selectedTargetBranchVersion : targetVersionInput;

                }
            })

            updateDeliveryModel.deliveryAssemblies[foundIndex] = { ...foundAssembly };

            setLoading(true);
            const updatedDeliveryModel = await modifyAssembly(updateDeliveryModel, "change");
            const newCurrentDelivery = { ...currentDelivery };

            //----------------only update the selected assembly---------------//
            newCurrentDelivery.deliveryAssemblies = updatedDeliveryModel.deliveryAssemblies;

            //----------------this two will be unchanged, so it is as same as previous current delivery---------------//
            newCurrentDelivery.clientDescription = currentDelivery.clientDescription;
            newCurrentDelivery.jiraLabelDescription = currentDelivery.jiraLabelDescription;

            setAssemblyInput("");
            dispatch(setCurrentDelivery(newCurrentDelivery));
            dispatch(updateDelivery(newCurrentDelivery));
            dispatch(resetAssemblyInput(true));
            setLoading(false);


        }
    }

    const handleDeleteAssembly = async () => {
        let updateDeliveryModel = { ...currentDelivery };

        delete updateDeliveryModel.clientDescription;
        delete updateDeliveryModel.jiraLabelDescription;

        //=====================CONFUSION: Should I replace with the latest date (the date when updating)===============//
        updateDeliveryModel.deliveryDate = currentDelivery.deliveryDate;
        updateDeliveryModel.deliveryId = currentDelivery.deliveryId;

        updateDeliveryModel.deliveryAssemblies = currentDelivery.deliveryAssemblies.filter(existingAssembly =>
            existingAssembly.deliveryAssemblyId != selectedAssembly.deliveryAssemblyId
        )

        setLoading(true);
        const updatedDeliveryModel = await modifyAssembly(updateDeliveryModel, "remove");
        const newCurrentDelivery = { ...currentDelivery };
        newCurrentDelivery.deliveryAssemblies = updatedDeliveryModel.deliveryAssemblies;

        dispatch(setCurrentDelivery(newCurrentDelivery));
        dispatch(updateDelivery(updatedDeliveryModel));

        dispatch(resetAssemblyInput(true));
        setLoading(false);
    }

    const handleRemoveSelectedAssembly = () => {
        dispatch(setSelectedAssembly(null));
        dispatch(resetAssemblyInput(true));
    }


    return (
        <>
            {selectedAssembly && showDeleteModal && <DeleteModal label={selectedAssembly.assembly} onDelete={handleDeleteAssembly} setShowModal={setShowDeleteModal} />}

            <div className='w-full px-6 py-2 flex justify-end'>
                <div className="flex gap-2">
                    {selectedAssembly &&
                        <button onClick={handleRemoveSelectedAssembly} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 transition duration-150 rounded-md flex gap-2 items-center'>
                            Remove Selected Assembly
                        </button>
                    }
                </div>
            </div>
            <div className="w-full flex items-center gap-3">
                <form className="flex gap-2 items-center" onSubmit={(e) => handleCreateDelivery(e)}>
                    <div className="flex flex-col">
                        <AssemblyDropdown data={assemblyData} label={"Assembly"} defaultValue={selectedAssemblyDescription}
                            onChangeHandler={setAssemblyInput} reset={resetAssemblyInputState}
                        />
                    </div>

                    <div className="flex flex-col">
                        <AssemblyDropdown data={branchVersions} label={"Current Branch Version"} defaultValue={selectedCurrentVersion}
                            onChangeHandler={setSourceVersionInput} reset={resetAssemblyInputState}
                        />
                    </div>

                    <div className="flex flex-col">
                        <AssemblyDropdown data={branchVersions} label={"Target Branch Version"} defaultValue={selectedTargetBranchVersion}
                            onChangeHandler={setTargetVersionInput} reset={resetAssemblyInputState}
                        />
                    </div>


                    {!selectedAssembly && <button onClick={() => setSubmissionType(submissionTypes.create)} className="cta flex-none" disabled={loading}>{loading ? "Adding..." : "Add"}</button>}
                    {selectedAssembly &&
                        <button onClick={() => setSubmissionType(submissionTypes.update)} className="cta" disabled={loading}>{loading ? "Changing..." : "Change"}</button>
                    }
                </form>

                {selectedAssembly &&
                    <div className="flex gap-2">
                        <button onClick={() => setShowDeleteModal(true)} className="cta bg-red-500">{"Remove"}</button>
                    </div>
                }
            </div>

        </>
    )
}

export default AssemblyInput