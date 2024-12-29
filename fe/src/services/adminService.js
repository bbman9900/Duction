import api from "./api";

export async function getCreateCommunityData() {
  try {
    const response = await api.get("admin/request/creat/community");
    return response.data;
  } catch (error) {
    console.error("Error fetching:", error);
    alert(error.response.data);
  }
}

export async function getDeleteItemData() {

}

export async function getReportData() {

}

export async function getValidationData() {

}