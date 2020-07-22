class OktaUser {

  public sub: string;
  public name: string;
  public locale: string;

  public email: string;
  public preferred_username: string;
  
  public given_name: string;
  public family_name: string;

  public zoneinfo: string;

  public updated_at: number;
  public email_verified: boolean;
}

export default OktaUser;