  <View>
        <ScrollView>
          <View style={styles.imgGroup}>
            <TouchableOpacity>
              <View style={styles.form}>
                <Text style={styles.iconText}>LIXO</Text>
                <Image source={require("../images/Icons/lixo-pin.png")} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={styles.form}>
                <Text style={styles.iconText}>Multibanco</Text>
                <Image source={require("../images/Icons/caixa-pin.png")} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={[styles.form, { opacity: 0.3 }]}>
                <Text style={styles.iconText}>Multibanco</Text>
                <Image source={require("../images/Icons/caixa-pin.png")} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={styles.form}>
                <Text style={styles.iconText}>LIXO</Text>
                <Image source={require("../images/Icons/lixo-pin.png")} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>