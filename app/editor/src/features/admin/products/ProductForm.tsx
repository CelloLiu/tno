import { FormikForm } from 'components/formik';
import { noop } from 'lodash';
import moment from 'moment';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProducts } from 'store/hooks/admin';
import {
  Button,
  ButtonVariant,
  Col,
  FieldSize,
  FormikCheckbox,
  FormikDatePicker,
  FormikText,
  FormikTextArea,
  IconButton,
  IProductModel,
  Modal,
  Row,
  Show,
  useModal,
} from 'tno-core';

import { defaultProduct } from './constants';
import * as styled from './styled';

/** The page used to view and edit tags in the administrative section. */
const ProductForm: React.FC = () => {
  const [, api] = useProducts();
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  const [product, setProduct] = React.useState<IProductModel>(
    (state as any)?.product ?? defaultProduct,
  );

  const { toggle, isShowing } = useModal();

  React.useEffect(() => {
    if (!!productId && product?.id !== productId) {
      setProduct({ ...defaultProduct, id: productId }); // Do this to stop double fetch.
      api.getProduct(productId).then((data) => {
        setProduct(data);
      });
    }
  }, [api, product?.id, productId]);

  const handleSubmit = async (values: IProductModel) => {
    try {
      const originalId = values.id;
      const result = !product.id ? await api.addProduct(values) : await api.updateProduct(values);
      setProduct(result);
      toast.success(`${result.name} has successfully been saved.`);

      if (!originalId) navigate(`/admin/products/${result.id}`);
    } catch {}
  };

  return (
    <styled.ProductForm>
      <IconButton
        iconType="back"
        label="Back to Products"
        className="back-button"
        onClick={() => navigate('/admin/products')}
      />
      <FormikForm
        initialValues={product}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <div className="form-container">
            <Col className="form-inputs">
              <FormikText width={FieldSize.Large} name="name" label="Name" />
              <FormikTextArea name="description" label="Description" width={FieldSize.Large} />
              <FormikText
                width={FieldSize.Tiny}
                name="sortOrder"
                label="Sort Order"
                type="number"
                className="sort-order"
              />
              <Col gap="0.5rem">
                <FormikCheckbox label="Is Enabled" name="isEnabled" />
                <FormikCheckbox label="Automatically transcribe when saved" name="autoTranscribe" />
              </Col>
              <Show visible={!!values.id}>
                <Row>
                  <FormikText
                    width={FieldSize.Small}
                    disabled
                    name="updatedBy"
                    label="Updated By"
                  />
                  <FormikDatePicker
                    selectedDate={
                      !!values.updatedOn ? moment(values.updatedOn).toString() : undefined
                    }
                    onChange={noop}
                    name="updatedOn"
                    label="Updated On"
                    disabled
                    width={FieldSize.Small}
                  />
                </Row>
                <Row>
                  <FormikText
                    width={FieldSize.Small}
                    disabled
                    name="createdBy"
                    label="Created By"
                  />
                  <FormikDatePicker
                    selectedDate={
                      !!values.createdOn ? moment(values.createdOn).toString() : undefined
                    }
                    onChange={noop}
                    name="createdOn"
                    label="Created On"
                    disabled
                    width={FieldSize.Small}
                  />
                </Row>
              </Show>
            </Col>
            <Row justifyContent="center" className="form-inputs">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
              <Show visible={!!values.id}>
                <Button onClick={toggle} variant={ButtonVariant.danger} disabled={isSubmitting}>
                  Delete
                </Button>
              </Show>
            </Row>
            <Modal
              headerText="Confirm Removal"
              body="Are you sure you wish to remove this product?"
              isShowing={isShowing}
              hide={toggle}
              type="delete"
              confirmText="Yes, Remove It"
              onConfirm={async () => {
                try {
                  await api.deleteProduct(product);
                  toast.success(`${product.name} has successfully been deleted.`);
                  navigate('/admin/products');
                } finally {
                  toggle();
                }
              }}
            />
          </div>
        )}
      </FormikForm>
    </styled.ProductForm>
  );
};

export default ProductForm;
