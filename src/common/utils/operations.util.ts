export const pageSizeToOffsetLimit = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const offset = (page - 1) * size;
  const limit = size;
  return { offset, limit };
};
