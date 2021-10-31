import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { StyleSheet, View, Dimensions, ScrollView, PixelRatio, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import Checkbox from "expo-checkbox";
import { normalAlert } from "../components/Alerts";
import { auth, database } from "../../Config/firebase";
import { heightPercentageToDP } from "../../Config/snippets";
import Loader from "../components/Loader";



export default (props) => {

  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidEmail, setisValidEmail] = useState(true);
  const [isValidPassword, setisValidPassword] = useState(true);
  const [isChecked, setChecked] = useState(false);
  const [btn, setBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  let login = () => {
    navigation.replace("Login");
  };

  const validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setEmail(text.trim());
      setisValidEmail(false);
      return false;
    } else {
      setEmail(text.trim());
      setisValidEmail(true);
      return true;
    }
  };

  const validatePassword = () => {
    var passwordSize = password.trim().length
    

    password !== '' && passwordSize<6 ? 
    normalAlert("Nova Conta", "A password precisa de ter pelo menos 6 caracteres", "Verificar")
    : password.trim() !== confirmPassword.trim() ? setisValidPassword(false) : setisValidPassword(true);


  };

  const handleSignUp = () => {
    var valid = isAllValid();

    valid ? 
      
          auth
          .createUserWithEmailAndPassword(email, password)
          .then((userCreadentials) => {
            const user = userCreadentials.user;
            const docRef = database.collection('users').doc(user.uid)
            
            docRef.set({
              name: name,
              email: user.email,
              map: false,
              permissions: 0
            }).then(async t => {
              user.sendEmailVerification(); 
              setTimeout(()=> {
                setIsLoading(false);
                normalAlert("Nova Conta", "Conta Criada com Sucesso! Bem Vindo a Equipa 😎", "Ok");
                login()
              }, 1000)
            })
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              normalAlert("Nova Conta", "O email já se encontra em uso! Tenta com outro email!", "Verificar");
            }

            console.log(error.message);
            setBtn(false);
          })
          
      : normalAlert("Nova Conta", "Verifica se todos os campos estão corretos!", "Verificar");
  };

  const isAllValid = () => {
    console.log("kkkk");
    var valid = false;
    console.log("Name - " + name.trim());
    console.log("isValidEmail - " + isValidEmail);
    console.log("isValidPassword - " + isValidPassword);
    console.log("isChecked - " + isChecked);

    name.trim() !== "" && isValidEmail && isValidPassword && isChecked ? (valid = true, setBtn(true)) : (valid = false);
    setIsLoading(true)
    return valid;
  };



  if(isLoading) {
    return(
     <Loader text={"A criar a conta... 🥳"}/>
    )
  }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
      <ScrollView style={styles.container}>
        <View>
          <View>
            <Text style={styles.novaConta}>Nova Conta</Text>
          </View>
          <View style={styles.formInputs}>
            <View style={styles.form}>
              <Text style={styles.inputTitle}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                }}
              />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
            </View>

            <View style={styles.form}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput style={styles.input} value={email} onChangeText={(text) => validate(text)} />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
              <Text style={!isValidEmail ? styles.notValid : styles.isValid}>Email Invalido</Text>
            </View>

            <View style={styles.form}>
              <Text style={[styles.inputTitle, styles.password]}>Password</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
            </View>
            <View style={styles.form}>
              <Text style={[styles.inputTitle, styles.password]}>Confirmar Password</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={confirmPassword}
                onBlur={validatePassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                }}
              />
              <View style={{ borderBottomColor: "#05164B", borderBottomWidth: 2 }} />
              <Text style={!isValidPassword ? styles.notValid : styles.isValid}>Passwords diferentes!</Text>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox value={isChecked} onValueChange={setChecked} style={styles.checkbox} color={isChecked ? "#05164B" : undefined} />
            <Text style={styles.terms}>Aceitas os termos e condições?</Text>
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={btn}>
              <Text style={styles.btnText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dontHaveAccount}>
            <Text style={styles.textCreate}>Já tens conta?</Text>
            <Text style={[styles.textCreate, styles.create]} onPress={login}>Login</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  novaConta: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: heightPercentageToDP("10%"),
    fontSize: RFValue(25),
    color: "#707070",
  },
  formInputs: {
    marginTop: heightPercentageToDP("2%"),
  },
  form: {
    marginHorizontal: 20,
    marginTop: heightPercentageToDP("5%"),
  },
  input: {
    height: 40,
    fontSize: RFValue(15),
  },
  inputTitle: {
    color: "#707070",
    fontSize: RFValue(15),
    fontWeight: "bold",
  },
  button: {
    marginTop: heightPercentageToDP("5%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "#05164B",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
  buttonOff: {
    marginTop: heightPercentageToDP("5%"),
    height: 50,
    alignItems: "center",
    backgroundColor: "gray",
    marginHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  textCreate: {
    fontWeight: "bold",
    marginTop: heightPercentageToDP("5%"),
    color: "#707070",
    fontSize: RFValue(17),
    textAlign: "center",
  },
  dontHaveAccount: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    color: "#30A24B",
  },
  create: {
    color: "#30A24B",
    paddingLeft: 10,
    textDecorationLine: "underline",
  },
  inisValidEmail: {
    color: "red",
    marginTop: heightPercentageToDP("1%"),
    opacity: 1,
    height: 0,
  },
  notValid: {
    color: "red",
    marginTop: heightPercentageToDP("1%"),
  },
  isValid: {
    color: "red",
    marginTop: heightPercentageToDP("1%"),
    opacity: 0,
    height: 0,
  },
  checkboxContainer: {
    marginTop: heightPercentageToDP("5%"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
    alignSelf: "center",
    height: 30,
    width: 30,
  },
  terms: {
    color: "#30A24B",
    fontSize: RFValue(15),
  },
});
