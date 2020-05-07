import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const Deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'avatar_id', 'email'],
    });

    res.json(Deliverymans);
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
      return res.status(400).json({ error: 'Delivery man already exists.' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    try {
      const { name, email, avatar_id } = req.body;

      const deliveryman = await Deliveryman.findByPk(req.params.id);

      if (email && email !== deliveryman.email) {
        const emailExist = await Deliveryman.findOne({
          where: { email: req.body.email },
        });

        if (emailExist) {
          return res
            .status(400)
            .json({ error: 'This email already exist, try other.' });
        }
      }

      if (email && email === deliveryman.email) {
        return res.status(400).json({ error: 'Cannot use the same email.' });
      }

      if (name && name === deliveryman.name) {
        return res
          .status(400)
          .json({ error: 'The name is the same as that registered.' });
      }

      if (avatar_id && avatar_id == deliveryman.avatar_id) {
        return res
          .status(400)
          .json({ error: 'The image is the same as the one being used.' });
      }

      const fileExist = await File.findOne({ where: { id: avatar_id } });

      if (!fileExist) {
        return res
          .status(400)
          .json({ error: "The image does't exist in database." });
      }

      const { id } = await deliveryman.update(req.body);

      return res.json({ id, name, email, avatar_id });
    } catch (err) {
      return res.status(400).json({ error: "Delivery man does't exist." });
    }
  }

  async delete(req, res) {
    try {
      const deliveryman = await Deliveryman.findByPk(req.params.id);

      await deliveryman.destroy();

      return res.status(200).json({ message: 'Success in deleting.' });
    } catch (err) {
      return res
        .status(400)
        .json({ erro: 'Delivery man not found or not exist.' });
    }
  }
}

export default new DeliveryManController();
