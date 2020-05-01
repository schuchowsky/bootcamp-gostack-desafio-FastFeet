import * as Yup from 'yup';
import Deliveryman from '../models/Deliverymans';

class DeliveryManController {
  async index(req, res) {
    const { id, name, avatar_id, email } = Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
    });

    res.json({ id, name, avatar_id, email });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExist) {
      return res.status(400).json({ error: 'Delivery Man already exists.' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    res.json();
  }

  async delete(req, res) {
    res.json();
  }
}

export default new DeliveryManController();
