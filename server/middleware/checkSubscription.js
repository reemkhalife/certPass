export const checkSubscription = async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const subscription = await Subscription.findOne({ _id: organizationId });

    if (!subscription || subscription.status !== 'active' || subscription.expiryDate < new Date()) {
      return res.status(403).json({ message: "Subscription expired or inactive. Please renew your subscription." });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking subscription status", error });
  }
};
