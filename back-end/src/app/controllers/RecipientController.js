import * as Yup from 'yup';
import Recipient from '../models/Recipients';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string().when('city', (city, field) =>
        city ? field.required() : field
      ),
      number: Yup.number()
        .when('street', (street, field) => (street ? field.required() : field))
        .when('city', (city, field) => (city ? field.required() : field)),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string().when('state', (state, field) =>
        state ? field.required() : field
      ),
      zip_code: Yup.number()
        .when('state', (state, field) => (state ? field.required() : field))
        .when('city', (city, field) => (city ? field.required() : field))
        .when('street', (street, field) => (street ? field.required() : field)),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    try {
      const recipient = await Recipient.findByPk(req.params.id);

      const {
        id,
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      } = await recipient.update(req.body);

      return res.json({
        id,
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      });
    } catch (err) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }
  }
}

export default new RecipientController();
