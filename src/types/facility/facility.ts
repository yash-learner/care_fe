export interface BaseFacility {
  id: string;
  name: string;
  description: string;
  address: string;
  local_body: number;
  district: number;
  state: number;
  facility_type: string;
  read_cover_image_url: string;
  features: string[];
}
