import { IoMdReturnLeft } from "react-icons/io";
import { toast } from "react-toastify"


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDeliveries() {
    try {
        const url = API_URL + "/api/delivery";
        const res = await fetch(url, {
            next: {
                revalidate: 10
            }
        });

        if (!res.ok)
            throw new Error("Failed to load Deliveries");

        const deliveries = await res.json();
        return deliveries;
    } catch (error) {
        toast.error(error.message);
    }
}

export async function getClients() {
    try {
        const url = API_URL + "/api/client";

        const res = await fetch(url, {
            next: {
                revalidate: 7200
            }
        });

        if (!res.ok)
            throw new Error("Failed to load Clients");

        const clients = await res.json();
        return clients;
    } catch (error) {
        toast.error(error.message);
    }
}

export async function getJiraLabels() {
    try {
        const url = API_URL + "/api/jira/labels";

        const res = await fetch(url, {
            next: {
                revalidate: 7200
            }
        });

        if (!res.ok)
            throw new Error("Failed to load Jira Labels!");

        const jiraLabels = await res.json();
        return jiraLabels;
    } catch (error) {
        toast.error(error.message);
    }
}

export async function createDelivery(data) {
    try {
        const url = API_URL + "/api/delivery";

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const res = await fetch(url, options);
        if (!res.ok)
            throw new Error("Failed to create new Delivery!");

        const newDelivery = await res.json();
        toast.success("New Delivery Created")
        return newDelivery;

    } catch (error) {
        toast.error(error.message);
    }
}

export async function deleteDelivery(id) {
    try {
        const url = API_URL + "/api/delivery/" + id;

        const options = {
            method: 'DELETE'
        };

        const res = await fetch(url, options);

        if (!res.ok)
            throw new Error("Failed to Delete Delivery!");


        const feedBack = await res.text();
        toast.success("Delivery Deleted");
        return feedBack;

    } catch (error) {
        toast.error(error.message);

    }
}

//---------------------------Assemblies----------------------------//

export async function getAssemblies() {
    try {
        const url = API_URL + "/api/gitlab/assemblies";
        const res = await fetch(url);

        if (!res.ok)
            throw new Error("Failed to get Assemblies!");

        const assemblies = await res.json();
        return assemblies;
    } catch (error) {
        toast.error(error.message);
    }
}


export async function getVersions() {
    try {
        const url = API_URL + "/api/gitlab/branchVersion";
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("Failed to get Branch Versions!");

        const versions = await res.json();
        return versions;
    } catch (error) {
        toast.error(error.message);
    }
}

export async function getBranchAssembles() {
    try {
        const url = API_URL + "/api/gitlab/branchAssemble";
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("Failed to get Assemblies");
        const versions = await res.json();
        return versions;
    } catch (error) {
        toast.error(error.message);
    }
}


export async function updateDeliveryService(data) {
    try {
        const url = API_URL + "/api/delivery";
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const res = await fetch(url, options);

        if (!res.ok)
            throw new Error("Failed to add new Assembly!");

        const newAssembly = await res.json();

        toast.success("Delivery Updated");

        return newAssembly

    } catch (error) {
        toast.error(error.message);
    }
}

export async function modifyAssembly(data, type) {
    try {
        const url = API_URL + "/api/delivery";
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const res = await fetch(url, options);

        if (!res.ok)
            throw new Error("Failed to add new Assembly!");

        const newAssembly = await res.json();

        if (type == "add")
            toast.success("New Assembly Added");
        else if (type == "change")
            toast.success("Assembly Updated");
        else if (type == "remove")
            toast.success("Assembly Removed");

        return newAssembly

    } catch (error) {
        toast.error(error.message);
    }
}