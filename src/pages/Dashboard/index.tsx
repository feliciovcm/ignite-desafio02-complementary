import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface FoodsProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

const Dashboard = () => {
  // ESTADOS DA APLICAÇÃO
  const [foods, setFoods] = useState<FoodsProps[]>([]);
  const [editingFood, setEditingFood] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get("/foods").then((response) => setFoods(response.data));
  }, []);

  const handleAddFood = async (food: any) => {
    api
      .post("/foods", { ...food, available: true })
      .then((res) => setFoods([...foods, res.data]))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateFood = async (food: any) => {
    api
      .put(`/foods/${editingFood.id}`, { ...editingFood, ...food })
      .then((res) => {
        const foodsUpdated = foods.map((f) =>
          f.id !== res.data.id ? f : res.data
        );
        setFoods(foodsUpdated);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: any) => {
    setEditingFood(food);
    setEditModalOpen(!editModalOpen);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
