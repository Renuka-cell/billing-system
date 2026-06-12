import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import toast from "react-hot-toast";

function ShopSettings() {

  const [formData, setFormData] = useState({
    shop_name: "",
    address: "",
    phone: "",
    email: "",
    gst_number: "",
  });

  const fetchShopDetails = async () => {

    try {

      const res = await API.get(
        "shop-settings/"
      );

      if (
        res.data &&
        Object.keys(res.data).length > 0
      ) {

        setFormData(res.data);

      }

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {

    fetchShopDetails();

  }, []);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.put(
        "shop-settings/",
        formData
      );

      toast.success(
        "Shop details updated successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to update shop details"
      );
    }
  };

  return (

    <Layout>

      <div className="bg-white rounded-2xl p-8 shadow-md">

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Shop Settings
        </h1>

        <p className="text-slate-500 mb-8">
          Manage shop information that appears on invoices.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="shop_name"
            value={formData.shop_name}
            onChange={handleChange}
            placeholder="Shop Name"
            className="w-full border rounded-xl px-4 py-3"
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows="4"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="gst_number"
            value={formData.gst_number}
            onChange={handleChange}
            placeholder="GST Number"
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Save Shop Details
          </button>

        </form>

      </div>

    </Layout>
  );
}

export default ShopSettings;