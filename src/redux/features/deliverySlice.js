import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    deliveries: [],
    clients: [],
    jiraLabels: [],
    deliveryModels: [],
    currentDelivery: null,
    selectedDelivery: null,
    createDeliveryModalOpen: false,
    assemblies: [],
    branchVersions: [],
    selectedAssembly: null,
    resetAssemblyInputState: false,
    resetDeliveryInputState : false
}

const deliverySlice = createSlice({
    name: "delivery",
    initialState,
    reducers: {
        setDeliveries: (state, action) => {
            state.deliveries = action.payload;
        },
        setDeliveryModel: (state, action) => {
            state.deliveryModels = action.payload;
        },
        addNewDeliveryModel: (state, action) => {
            state.deliveryModels.push(action.payload);
        },
        createNewDelivery: (state, action) => {
            state.deliveries.push(action.payload);
        },
        updateDelivery: (state, action) => {
            const newDelivery = action.payload;
            state.deliveryModels.forEach(delivery => {

                if (delivery.deliveryId == newDelivery.deliveryId) {
                    delivery.deliveryDescription = newDelivery.deliveryDescription;
                    delivery.deliveryLabel = newDelivery.deliveryLabel;
                    delivery.deliveryDate = newDelivery.deliveryDate;
                    delivery.clientId = newDelivery.clientId;
                    delivery.jiraLabelDescription = newDelivery.jiraLabelDescription;
                    delivery.clientDescription = newDelivery.clientDescription;

                    delivery.deliveryAssemblies = newDelivery.deliveryAssemblies;
                }

            })

        },
        setClients: (state, action) => {
            state.clients = action.payload;
        },
        setJiraLabels: (state, action) => {
            state.jiraLabels = action.payload
        },
        setCurrentDelivery: (state, action) => {
            state.currentDelivery = action.payload;
        },
        setSelectedDelivery: (state, action) => {
            state.selectedDelivery = action.payload;
        },
        setCreateDeliveryModalOpen: (state, action) => {
            state.createDeliveryModalOpen = !state.createDeliveryModalOpen;
        },
        setAssemblies: (state, action) => {
            state.assemblies = action.payload;
        },
        setBranchVersions: (state, action) => {
            state.branchVersions = action.payload;
        },
        setSelectedAssembly: (state, action) => {
            state.selectedAssembly = action.payload;
        },
        resetAssemblyInput: (state, action) => {
            state.resetAssemblyInputState = action.payload;
        },
        resetDeliveryInput: (state, action) => {
            state.resetDeliveryInputState = action.payload;
        }
    }
})

export const {
    setDeliveries,
    setDeliveryModel,
    updateDelivery,
    addNewDeliveryModel,
    setSelectedDelivery,
    setCurrentDelivery,
    setCreateDeliveryModalOpen,
    setClients,
    setJiraLabels,
    createNewDelivery,
    setAssemblies,
    setBranchVersions,
    setSelectedAssembly,
    resetAssemblyInput,
    resetDeliveryInput
}
    = deliverySlice.actions;


export default deliverySlice.reducer;